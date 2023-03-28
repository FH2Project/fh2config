/* web MIDI support: © 2022 - Ian Sayer */

let Access = undefined;
let Options = undefined;

let lastPulseTime = 0;
let deltaPulseTime = 0;

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
    let cmd = event.data[0];
    switch (cmd>>4) {
        case 0xF: // clock event
            if (Options.transport_element){
                switch (cmd) {
                case 0xF8: //midi clock
                    Options.pcnt++;
                    if (Options.pcnt>=Options.ppq){
                        Options.pcnt = 0;
                        if (lastPulseTime) {
                            deltaPulseTime = event.timeStamp - lastPulseTime;
                            Options.transport_element.dataset.tempo = Math.round(60/(deltaPulseTime/1000));
                        }
                        lastPulseTime = event.timeStamp;
                    }
                    break;
                case 0xFA: // start
                    Options.transport_element.dataset.playing = true;
                    break;
                case 0xFB: // continue
                    Options.transport_element.dataset.playing = true;
                    break;
                case 0xFC: // stop
                    Options.transport_element.dataset.playing = false;
                    break;
                }
            }
            break;
        case 9: // note on
            console.log(`${event.data[0].toString(16)} ${event.data[1]} ${event.data[2]}`);
    }
}

function onMIDIDeviceStatusChange(event){
    if (Options?.device_name==event.port.name){
        if (event.port.state=="connected") {
            event.port.onmidimessage = Options.EventProcessor||defaultEventProcessor;
            updateMIDIConnectionStatus(`Connected to ${Options.device_name}`, true);
        } else
            updateMIDIConnectionStatus(`${Options.device_name} Disconnected`, false);
    }
}

function setEventProcessor(access){
    access.inputs.forEach(function (entry){entry.onmidimessage = Options.EventProcessor||defaultEventProcessor});
}

function onMIDISuccess(access){
    Access = access;
    Access.onstatechange = onMIDIDeviceStatusChange;
    let primary_device = undefined;
    if (Options.device_name) {
        let mo = Array.from(Access.outputs.entries(), u=>u[1]);
        primary_device = mo.find(u=>u.name==Options.device_name);
        if (primary_device){
            Access.primary_device = primary_device;
        } else {
            updateMIDIConnectionStatus(`Cannot find device > ${Options.device_name}`, false);
        }
    }
    setEventProcessor(access);
    Access.outputs.forEach(o => console.log(o));
    if (primary_device)
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