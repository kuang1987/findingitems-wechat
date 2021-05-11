var Http = require('./http.js')

function storeItem(audio_url, instruction, locId, success=null, fail=null) {
  Http.post(
    '/instruction/add/',
    {
      "audio_url": audio_url,
      "text": instruction,
      "type": 0,
      "location_id": locId
    },
    success,
    fail
  )
}

function findingItem(audio_url, instruction, success=null, fail=null) {
  Http.post(
    '/instruction/add/',
    {
      "audio_url": audio_url,
      "text": instruction,
      "type": 1,
    },
    success,
    fail
  )
}

function listInstruction(page, pageSize, locId=0, success=null, fail=null) {
  let query = {
    'page': page,
    'page_size': pageSize
  }
  if(locId!=0) {
    query = {
      'page': page,
      'page_size': pageSize,
      'location_id': locId,
    }
  }
  Http.get(
    '/instruction/list/',
    query,
    success,
    fail
  )
}

function searchInstruction(page, pageSize, instructionId, success=null, fail=null) {
  Http.get(
    '/instruction/search/',
    {
      'instruction_id': instructionId,
      'page': page,
      'page_size': pageSize
    },
    success,
    fail
  )
}

function deleteInstruction(id, success=null, fail=null) {
  console.log('delete ' + id)
  Http.post(
    '/instruction/' + id + '/delete/',
    {},
    success,
    fail
  )
}

module.exports = {
  storeItem: storeItem,
  listInstruction: listInstruction,
  deleteInstruction: deleteInstruction,
  findingItem: findingItem,
  searchInstruction: searchInstruction,
}