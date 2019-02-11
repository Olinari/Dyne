const mongoose = require('mongoose');
const _ = require('lodash');
const { Schema } = mongoose;

const roleSchema = new Schema({
	name: String,
	createdAt: {
		type: Date,
		required: true
	},
	modifiedAt: {
		type: Date,
		required: true
	}
});

class RoleClass {


}

roleSchema.loadClass(RoleClass);

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;