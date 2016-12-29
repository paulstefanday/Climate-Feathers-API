const auth = require('feathers-authentication')
const local = require('feathers-authentication-local')
const jwt = require('feathers-authentication-jwt')
const permissions = require('feathers-permissions')
const middleware = permissions.middleware;
const hooks = require('feathers-hooks')
const common = require('feathers-hooks-common')
const admin = {
    permissions: ['admin'],
    on: 'users',
    field: 'permission'
};



// common.populate('user', { service: 'users', field: 'userId' })

module.exports = {
	loggedIn: [ auth.hooks.authenticate(['jwt', 'local']), permissions.hooks.checkPermissions({ service: 'users' }), permissions.hooks.isPermitted() ],
	isOwner: [], //[ ...loggedIn, auth.hooks.restrictToOwner({ idField: 'id', ownerField: 'userId' })],
	createdAt: hook => { hook.data.createdAt = new Date() },
	updatedAt: hook => { hook.data.updatedAt = new Date() },
	disable: hooks.disable('external'),
	hashPassword: local.hooks.hashPassword({ passwordField: 'password' }),
	addUserId: () => {}, //auth.hooks.associateCurrentUser({ idField: 'id', as: 'userId' }),
	filterByUser: () => {},// auth.hooks.queryWithCurrentUser({ idField: 'id', as: 'id' }),
	isAdmin: middleware.checkPermissions(admin)
}
