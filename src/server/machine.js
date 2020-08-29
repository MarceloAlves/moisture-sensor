const rpio = require('rpio')
const { Machine, interpret, assign } = require('xstate')

function readPin(ctx, evt) {
  return new Promise((resolve, reject) => {
    rpio.open(8, rpio.INPUT)
    const result = rpio.read(8)
    rpio.close(8)
    resolve({ reading: result })
  })
}

const MOISTURE_LEVEL = {
  WET: 1,
  DRY: 0,
}

const soilMachine = Machine(
  {
    id: 'soil',
    initial: 'startup',
    context: {
      notificationSent: false,
      previousReading: null,
      currentReading: null,
    },
    states: {
      startup: {
        invoke: {
          id: 'pinChecking',
          src: readPin,
          onDone: {
            target: 'idle',
            actions: ['setPinValue'],
          },
        },
      },
      idle: {
        after: {
          120000: 'checkingPin',
        },
      },
      checkingPin: {
        invoke: {
          id: 'pinChecking',
          src: readPin,
          onDone: {
            target: 'sendingAlert',
            actions: ['setPinValue'],
          },
        },
      },
      sendingAlert: {
        always: [
          {
            cond: 'shouldSendAlert',
            actions: 'sendAlert',
            target: 'idle',
          },
          { target: 'idle' },
        ],
      },
    },
  },
  {
    actions: {
      sendAlert: () => {
        console.log('FEED ME SEYMOUR!')
      },
      setPinValue: assign((ctx, evt) => ({
        previousReading: ctx.currentReading || evt.data.reading,
        currentReading: evt.data.reading,
      })),
    },
    guards: {
      isWet: (ctx, evt) => ctx.currentReading === MOISTURE_LEVEL.WET,
      shouldSendAlert: (ctx, evt) => {
        return ctx.previousReading !== ctx.currentReading && ctx.currentReading === MOISTURE_LEVEL.DRY
      },
    },
  }
)

module.exports = {
  soilMachine,
}
