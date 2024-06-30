const dpadXPin = AnalogPin.P1
const dpadYPin = AnalogPin.P0
const aBtnPin = DigitalPin.P2

pins.setPull(aBtnPin, PinPullMode.PullUp)

let y = 0
let x = 0
gamepad.startGamepadService()

gamepad.setStatusChangeHandler(() => {
    if ( gamepad.isEnabled() )
        basic.showString("C", 0)
    else
        basic.showString("D", 0)
})

basic.forever(function () {
    if ( ! gamepad.isEnabled() ) {
        basic.showString("Waiting", 50)
        basic.pause(3000)
        return
    }
        
    let dpad, lastDpad: GameDirection
    let btns, lastBtns: number

    // right
    if (pins.analogReadPin(dpadXPin) < 340) {
        x = 0
    } else if (pins.analogReadPin(dpadXPin) > 680) {
        x = 2
    } else {
        x = 1
    }
    // down
    if (pins.analogReadPin(dpadYPin) < 340) {
        y = 8
    } else if (pins.analogReadPin(dpadYPin) > 680) {
        y = 0
    } else {
        y = 4
    }
    switch(x + y) {
        case 0:
            dpad = GameDirection.upLeft
            basic.showArrow(ArrowNames.NorthWest, 0)
            break;
        case 1:
            dpad = GameDirection.up
            basic.showArrow(ArrowNames.North, 0)
            break;
        case 2:
            dpad = GameDirection.upRight
            basic.showArrow(ArrowNames.NorthEast, 0)
            break;
        case 4:
            dpad = GameDirection.left
            basic.showArrow(ArrowNames.West, 0)
            break;
        case 5:
            dpad = GameDirection.noDirection
            basic.showIcon(IconNames.SmallDiamond, 0)
            break;
        case 6:
            dpad = GameDirection.right
            basic.showArrow(ArrowNames.East, 0)
            break;
        case 8:
            dpad = GameDirection.downLeft
            basic.showArrow(ArrowNames.SouthWest, 0)
            break;
        case 9:
            dpad = GameDirection.down
            basic.showArrow(ArrowNames.South, 0)
            break;
        case 10:
            dpad = GameDirection.downRight
            basic.showArrow(ArrowNames.SouthEast, 0)
            break;
    }
    btns = pins.digitalReadPin(aBtnPin) ? GameButton.none : GameButton.A
    if ( pins.digitalReadPin(aBtnPin))
       led.plotBrightness(0, 0, 255)
    if ( btns !== lastBtns || dpad !== lastDpad) {
        gamepad.send(btns, 0, 0, dpad, 0, 0)
        if (btns & GameButton.A)
          music.tonePlayable(Note.C, music.beat(BeatFraction.Whole))
        lastDpad = dpad
        lastBtns = btns
    }
})
