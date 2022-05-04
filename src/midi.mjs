/* web MIDI support */

let Access = undefined;
let Options = undefined;

function MIDIError(errorMessage){
    console.log(errorMessage);
    if (Options.error_element){
        Options.error_element.classList.add("error");
        Options.error_element.dataset.message = errorMessage;
    }
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

function onMIDISuccess(access){
    Access = access;
    if (Options.device_name) {
        let mo = Array.from(Access.outputs.entries(), u=>u[1]);
        let pd = mo.find(u=>u.name==Options.device_name);
        Access.primary_device = pd;
        if (!pd){
            MIDIError(`Cannot find device > ${Options.device_name}`);
        }
    }
    if (Options.EventProcessor)
        Access.inputs.forEach(function (entry){entry.onmidimessage = Options.EventProcessor});
    else
        Access.inputs.forEach(function (entry){entry.onmidimessage = defaultEventProcessor});
    Access.outputs.forEach(o => console.log(o));
    if (Options.error_element&&!Options.error_element.dataset.message) {
        Options.error_element.dataset.message = `Connected to ${Options.device_name}`;
    }
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