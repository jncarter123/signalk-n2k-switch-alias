const PLUGIN_ID = 'signalk-n2k-switch-alias'
const PLUGIN_NAME = 'NMEA 2000 Switch Alias'
const retryMax = 3
const retryDelay = 500

module.exports = function(app) {
  var plugin = {}
  var n2kCallback
  var sgOptions

  plugin.id = PLUGIN_ID
  plugin.name = PLUGIN_NAME
  plugin.description = 'Allows a switch that sends its own switch bank state via PGN127501 such as the Maretron CKM12 to control other switch banks on the network.'

  plugin.schema = function() {
    var schema = {
      type: "object",
      properties: {
        aliases: {
          type: "array",
          title: "Switch Alias",
          items: {
            type: "object",
            required: [
              "instance",
              "indicator",
              "controlPath",
              "action"
            ],
            properties: {
              instance: {
                type: "number",
                title: "NMEA Instance",
                description: ""
              },
              indicator: {
                type: "number",
                title: "NMEA Indicator",
                description: ""
              },
              controlPath: {
                type: "string",
                title: "SignalK Switch Path",
                description: ""
              },
              action: {
                type: "string",
                title: "Action",
                enum: [
                  "Toggle On/Off",
                  "Toggle On",
                  "Toggle Off",
                  "Momentary"
                ],
                default: "Toggle On/Off"
              }
            }
          }
        }
      }
    }

    return schema
  }

  plugin.start = function(options, restartPlugin) {
    sgOptions = options

    n2kCallback = (msg) => {
      try {
        var fields = msg['fields']

        if (msg.pgn == 127501) {
          let aliases = sgOptions.aliases.filter(alias => alias.instance === fields['Instance'])
          aliases.forEach((alias) => {
            let indicator = `Indicator${alias.indicator}`

            if (fields[indicator] === 'On' || alias.action == 'Momentary') {

              let currentValue = app.getSelfPath(alias.controlPath).value
              let newValue = 'Off'

              switch (alias.action) {
                case 'Toggle On/Off':
                  newValue = currentValue === 1 ? 0 : 1
                  break
                case 'Toggle On':
                  newValue = 1
                  break
                case 'Toggle Off':
                  newValue = 0
                  break
                case 'Momentary':
                  newValue = fields[indicator] === 'On' ? 1 : 0
                  break
              }

              if (currentValue != newValue) {
                app.debug(`Received a switch alias control update. Setting ${alias.controlPath} to ${newValue}`)
                sendPut(alias.controlPath, newValue)
              }
            }
          });

        }
      } catch (e) {
        console.error(e)
      }
    }
    app.on("N2KAnalyzerOut", n2kCallback)

  }

  plugin.stop = function() {
    if (n2kCallback) {
      app.removeListener("N2KAnalyzerOut", n2kCallback)
      n2kCallback = undefined
    }

    app.debug('Plugin stopped.')
  }

  function handleChange(path, value) {

  }

  function sendPut(path, value) {
    app.putSelfPath(path, value, res => {
      app.debug(JSON.stringify(res))
      if (res.state == 'COMPLETED') {
        res.path = path
        res.value = value

        if (res.statusCode === 200) {
          app.debug(`Executed ${path} set to ${value}`)
        } else {
          app.debug(`Execution error ${res.statusCode} ${res.message} while settting ${path} to ${value}`)
        }
      }
    })
  }

  function rejectDelay(reason) {
    return new Promise(function(resolve, reject) {
      setTimeout(reject.bind(null, reason), retryDelay);
    });
  }

  function actionHandler(context, path, dSource, value, cb) {
    app.debug(`setting ${path} to ${value}`)

    try {
      handleChange(path, value)

      cb({
        state: 'SUCCESS'
      })
    } catch (err) {
      app.error(err)

      cb({
        state: 'FAILURE'
      })
    }

    return {
      state: 'SUCCESS'
    }
  }

  function subscription_error(err) {
    app.setProviderError(err)
  }

  return plugin;
};
