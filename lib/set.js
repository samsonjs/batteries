// batteries
// Copyright 2010 - 2011 Sami Samhuri <sami@samhuri.net>

exports.Set = Set;

exports.extendNative = function(context) {
  context.Set = Set;
};

var ownProps = Object.getOwnPropertyNames;

function Set(items) {
  if (!Array.isArray(items)) items = [].slice.call(arguments);
  var n = 0;
  this.members = items.reduce(function(set, x) {
    if (!(x in set)) {
      n += 1;
      set[x] = x;
    }
    return set;
  }, Object.create(null));
  this.size = n;
}

Set.prototype.add = function(item) {
  if (!(item in this.members)) {
    this.members[item] = item;
    this.size += 1;
  }
};

Set.prototype.clear = function() {
  this.members = Object.create(null);
  this.size = 0;
};

Set.prototype.contains = function(item) {
  return item in this.members;
}

Set.prototype.diff = function(other) {
  var d = []
    , x
    ;
  for (x in this.members) if (!(x in other.members)) d.push(this.members[x]);
  return new Set(d);
};

Set.prototype.isEmpty = function() {
  return this.size === 0;
};

Set.prototype.remove = function(item) {
  if (item in this.members) {
    delete this.members[item];
    this.size -= 1;
  }
};

Set.prototype.toArray = function() {
  var ms = this.members;
  return ownProps(this.members).map(function(k) { return ms[k]; });
};

Set.prototype.union = function(other) {
  var ms = this.members
    , u = ownProps(this.members).map(function(k) { return ms[k]; });
  ms = other.members;
  u = u.concat(ownProps(ms).map(function(k) { return ms[k]; }));
  return new Set(u);
};
