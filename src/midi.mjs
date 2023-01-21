/* web MIDI support: © 2022 - Ian Sayer */

let Access = undefined;
let Options = undefined;

/**
 * updateMIDIConnectionStatus
 * @param {string} message 
 * @param {boolean} connected 
 */
function updateMIDIConnectionStatus(message, connected){
    console.log(message);
    if (Options.error_element){
        Options.error_element.classList[connected?"remove":"add"]("error");
        Options.error_element.dataset.message = message;
    }
    // add code to sync DOM list of midi devices
}

function defaultEventProcessor(event){
    let cmd = event.data[0] >> 4;
    switch (cmd) {
        case 0xf: // stop clock nagging
            break;
        case 9: // note on
            console.log(`${event.data[0].toString(16)} ${event.data[1]} ${event.data[2]}`);
    }
}

function onMIDIDeviceStatusChange(event){
    if (Options?.device_name==event.port.name){
        if (event.port.state=="connected")
            updateMIDIConnectionStatus(`Connected to ${Options.device_name}`, true);
        else
            updateMIDIConnectionStatus(`${Options.device_name} Disconnected`, false);
    }
}

function onMIDISuccess(access){
    Access = access;
    Access.onstatechange = onMIDIDeviceStatusChange;
    if (Options.device_name) {
        let mo = Array.from(Access.outputs.entries(), u=>u[1]);
        let pd = mo.find(u=>u.name==Options.device_name);
        Access.primary_device = pd;
        if (!pd){
            updateMIDIConnectionStatus(`Cannot find device > ${Options.device_name}`, false);
        }
    }
    if (Options.EventProcessor)
        Access.inputs.forEach(function (entry){entry.onmidimessage = Options.EventProcessor});
    else
        Access.inputs.forEach(function (entry){entry.onmidimessage = defaultEventProcessor});
    Access.outputs.forEach(o => console.log(o));
    updateMIDIConnectionStatus(`Connected to ${Options.device_name}`, true)
}
/**
 * Initialise Browser MIDI
 * @param {Object} options =>
 *      .EventProcessor (callback on midi in activity, default just console.logs data
 *      .error_element (a dom element to attach error class/message to)
 *      .device_name (Name of MIDI device that should be connected)
 */
export const init = (options) => {
    Options = options||{};
    // check if browser supports midi & setup
    if (!navigator.requestMIDIAccess) {
        MIDIError("This browser doesn't support MIDI");
        return;
    }
    navigator.requestMIDIAccess({ sysex: true }).then(onMIDISuccess, u => MIDIError("Request midi access failed"));
}