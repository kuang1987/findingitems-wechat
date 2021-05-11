var Http = require('./http.js')

function listLocs(success, fail) {
  Http.get(
    '/location/membership/list/',
    {
      'page': 1,
      'page_size': 20,
    },
    success,
    fail
  )
}

function updateLoc(id, data, success, fail) {
  Http.post(
    `/location/${id}/edit/`,
    data,
    success,
    fail
  )
}

function updateLocMember(id, data, success, fail) {
  Http.post(
    `/location/membership/${id}/edit/`,
    data,
    success,
    fail
  )
}

function setDefaultLoc(id, success, fail) {
  updateLocMember(id,
    {
      is_default: true
    }, success, fail)
}

function deleteLoc(id, success, fail) {
  Http.post(
    `/location/${id}/delete/`,
    {},
    success,
    fail
  )
}

function deleteOrLeaveLoc(loc, success, fail) {
  if(loc.role == 0) {
    Http.post(
      `/location/${loc.id}/delete/`,
      {},
      success,
      fail
    )
  } else {
    Http.post(
      `/location/membership/${loc.membership_id}/delete/`,
      {},
      success,
      fail
    )
  }
}

function removeLocMember(locMembershipId, memberUserId, success, fail) {
  Http.post(
    `/location/membership/${locMembershipId}/removeMember/`,
    {
      member_user_id: memberUserId
    },
    success,
    fail
  )
}

function addLoc(locObj, success, fail) {
  Http.post(
    `/location/add/`,
    locObj,
    success,
    fail
  )
}

function setDetfaultOrder(locs, defaultLocId) {
  var newLocs = []
  var dLoc = null
  for(let i=0; i < locs.length; i++) {
    let loc = Object.assign({}, locs[i].location)
    loc.membership_id = locs[i].id
    loc.role = locs[i].role
    loc.is_default = false
    loc.alias_name = locs[i].alias_name
    loc.owner = locs[i].owner
    loc.members = locs[i].members
    if(loc.id == defaultLocId) {
      loc.is_default = true
      dLoc = loc
      continue
    }
    newLocs.push(loc)
  }
  newLocs.push(dLoc)
  return newLocs.reverse()
}

function listInvitations(success, fail) {
  Http.get(
    '/location/invitation/list/',
    {
      'page': 1,
      'page_size': 100,
    },
    success,
    fail
  )
}

function addInvitation(locId, success, fail) {
  Http.post(
    `/location/invitation/add/`,
    {loc_id: locId},
    success,
    fail
  )
}

function updateLocInvitation(locInvitationId, status, success, fail) {
  Http.post(
    `/location/invitation/${locInvitationId}/edit/`,
    {status: status},
    success,
    fail
  )
}

module.exports = {
  listLocs: listLocs,
  updateLoc: updateLoc,
  deleteLoc: deleteLoc,
  addLoc: addLoc,
  setDefaultLoc: setDefaultLoc,
  setDetfaultOrder: setDetfaultOrder,
  updateLocMember: updateLocMember,
  deleteOrLeaveLoc: deleteOrLeaveLoc,
  listInvitations: listInvitations,
  addInvitation: addInvitation,
  removeLocMember: removeLocMember,
  updateLocInvitation: updateLocInvitation
}