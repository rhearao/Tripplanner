const User = require("./user");
const Group = require("./group");
const Event = require("./event");
const UserGroup = require("./userGroup");
// const Vote = require('./vote')

// User.hasMany(Review)
// Review.belongsTo(User)

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

Group.hasMany(Event);
Event.belongsTo(Group);

// User.belongsToMany(Location, { through: UserLocation })
// Location.belongsToMany(User, { through: UserLocation })


module.exports = {
  User,
  Group,
  Event,
  UserGroup
};
