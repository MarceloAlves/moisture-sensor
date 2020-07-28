const rpio = require('rpio')
const { Machine, interpret, assign } = require('xstate')

function readPin() {
  rpio.open(8, rpio.INPUT)
  const result = rpio.read(8)
  rpio.close(8)
  return result
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
        on: {
          SETUP: {
            actions: ['initialReading'],
            target: 'idle',
          },
        },
      },
      idle: {
        after: {
          120000: 'running',
        },
      },
      running: {
        on: {
          '': {
            actions: 'checkPin',
            target: 'sendingAlert',
          },
        },
      },
      sendingAlert: {
        on: {
          '': [
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
  },
  {
    actions: {
      initialReading: assign((ctx, evt) => {
        const result = readPin()
        return {
          previousReading: result,
          currentReading: result,
        }
      }),
      checkPin: assign((ctx, evt) => {
        const currentReading = readPin()
        return {
          previousReading: ctx.currentReading,
          currentReading,
        }
      }),
      sendAlert: () => {
        console.log('FEED ME SEYMOUR!')
      },
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
