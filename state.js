
// private
var status = []   // State of the elements

// Constructor
function State(status) {
    this.status = status;
    return this
}

// Constructor
module.exports = State; 
function State() {
    return this
}


/* Checks if the state of the status has changed
   Returns the element location */
//module.exports.stateHasChanged = function(res) {
State.prototype.stateHasChanged = function(res) {
    for (let i = 0; i < status.length; i++) {
        if (status[i]['url'] == res.element) {
            if (status[i]['status'] != res.status) {
                return true
            }
        }
    }
    return false;
}

/* Splices same values from state */
State.prototype.replaceStatus = function(res) {
    for(let i = 0; i < status.length; i++) {
        if (status[i]['url'] == res.element) {
            status[i]['status'] = res.status
            return
        }
    }
    return
}

State.prototype.addToState = function( res ) {
    status.push( { 'url': res.element, 'status': res.status } )
    console.log("added")
}

State.prototype.getStatus = function() {
    return status
}
