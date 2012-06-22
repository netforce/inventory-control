(function() {
  var CouchDbUserRepository, flatten_roles, normalize_post_values, role_membership, user_repo, user_repo_module, validate_user_state, _;

  _ = (require("underscore"))._;

  user_repo_module = require("../middleware/couchdb_user_repository.js");

  CouchDbUserRepository = user_repo_module.CouchDbUserRepository;

  user_repo = new CouchDbUserRepository({
    couchdb_url: "http://192.168.192.143:5984/"
  });

  validate_user_state = function(user) {
    var valid;
    valid = true;
    if (user.first_name == null) valid = false;
    if (user.last_name == null) valid = false;
    if (user.logon_name == null) valid = false;
    return valid;
  };

  normalize_post_values = function(user, roles) {
    var new_user, role, v;
    if (validate_user_state(user)) {
      new_user = {};
      _.extend(new_user, user);
      new_user.roles = [];
      new_user.roles.push("user");
      for (role in roles) {
        v = roles[role];
        new_user.roles.push(role);
      }
      new_user.email = "" + new_user.logon_name + "@bericotechnologies.com";
      new_user.id = new_user.email;
      return new_user;
    } else {
      return null;
    }
  };

  flatten_roles = function(roles) {
    var membership, role, _i, _len;
    membership = {};
    for (_i = 0, _len = roles.length; _i < _len; _i++) {
      role = roles[_i];
      membership[role] = true;
    }
    return membership;
  };

  role_membership = function(roles) {
    var default_memberships, memberships;
    memberships = flatten_roles(roles);
    default_memberships = {
      admin: false,
      view_inventory: false,
      view_reports: false,
      add_inventory: false,
      remove_inventory: false,
      assign_inventory: false,
      check_in_inventory: false
    };
    _.extend(default_memberships, memberships);
    return default_memberships;
  };

  module.exports.create = function(req, res) {
    var user;
    user = normalize_post_values(req.body.user, req.body.roles);
    if (user !== null) {
      console.log("Adding User");
      user_repo.add(user);
    }
    return res.json({
      status: "ok"
    });
  };

  module.exports.create_form = function(req, res) {
    return res.render("users_create", {
      title: "Add New User",
      user: req.user
    });
  };

  module.exports.get = function(req, res) {
    return user_repo.get(req.params.id, function(user) {
      return res.json(user);
    });
  };

  module.exports.remove = function(req, res) {
    return console.log(req.params.id);
  };

  module.exports.remove_form = function(req, res) {
    return user_repo.get(req.params.id, function(user) {
      return res.render("users_remove", {
        title: "Remove User?",
        user: req.user
      });
    });
  };

  module.exports.update = function(req, res) {
    var user;
    user = normalize_post_values(req.body.user, req.body.roles);
    if (user !== null) {
      console.log("Updating User");
      user_repo.update(user);
    }
    return res.json({
      success: "ok"
    });
  };

  module.exports.update_form = function(req, res) {
    return user_repo.get(req.params.id, function(user) {
      var roles;
      roles = role_membership(user.roles);
      return res.render("users_update", {
        title: "Update User",
        user: user,
        roles: roles
      });
    });
  };

  module.exports.by_role = function(req, res) {
    return user_repo.get_by_role(req.params.role, function(users) {
      return res.json(users);
    });
  };

  module.exports.by_last_name = function(req, res) {
    return user_repo.get_by_last_name(req.params.last_name, function(users) {
      return res.json(users);
    });
  };

}).call(this);
