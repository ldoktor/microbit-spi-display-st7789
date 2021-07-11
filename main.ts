let LCD_SCL = DigitalPin.P13
let LCD_SDA = DigitalPin.P15
let LCD_RST = DigitalPin.P8
let LCD_DC = DigitalPin.P12
let LCD_CS = DigitalPin.P16
let LCD_BLK = AnalogPin.P1
let LCD_WIDTH = 160
let LCD_HEIGHT = 128
let MODE = 0
let COLOR = 0
function set_cs(value: number) {
    pins.digitalWritePin(LCD_CS, value)
}

function set_dc(value: number) {
    pins.digitalWritePin(LCD_DC, value)
}

function lcd_write_reg(data: number) {
    set_dc(0)
    set_cs(0)
    pins.spiWrite(data)
    set_cs(1)
}

function lcd_write_8bit(data: number) {
    set_dc(1)
    set_cs(0)
    pins.spiWrite(data)
    set_cs(1)
}

function lcd_write_buf(data: number, count: number) {
    set_dc(1)
    set_cs(0)
    for (let _ = 0; _ < count; _++) {
        pins.spiWrite(data >> 8)
        pins.spiWrite(data & 0xFF)
    }
    set_cs(1)
}

function lcd_init() {
    //  start spi
    pins.spiPins(LCD_SDA, DigitalPin.P14, LCD_SCL)
    pins.spiWrite(0x00)
    //  back light
    pins.analogSetPeriod(LCD_BLK, 20)
    //  LCD_SPI_Init
    pins.spiFrequency(1000000)
    pins.spiFormat(8, 0)
    set_cs(1)
    //  LCD_Reset
    pins.digitalWritePin(LCD_RST, 1)
    basic.pause(100)
    pins.digitalWritePin(LCD_RST, 0)
    basic.pause(100)
    pins.digitalWritePin(LCD_RST, 1)
    //  Initialize LCD register
    // # Frame Rate
    lcd_write_reg(0xB1)
    lcd_write_8bit(0x01)
    lcd_write_8bit(0x2C)
    lcd_write_8bit(0x2D)
    lcd_write_reg(0xB2)
    lcd_write_8bit(0x01)
    lcd_write_8bit(0x2C)
    lcd_write_8bit(0x2D)
    lcd_write_reg(0xB3)
    lcd_write_8bit(0x01)
    lcd_write_8bit(0x2C)
    lcd_write_8bit(0x2D)
    lcd_write_8bit(0x01)
    lcd_write_8bit(0x2C)
    lcd_write_8bit(0x2D)
    // # Column inversion
    lcd_write_reg(0xB4)
    lcd_write_8bit(0x07)
    //  ST7735R Power Sequence
    lcd_write_reg(0xC0)
    lcd_write_8bit(0xA2)
    lcd_write_8bit(0x02)
    lcd_write_8bit(0x84)
    lcd_write_reg(0xC1)
    lcd_write_8bit(0xC5)
    lcd_write_reg(0xC2)
    lcd_write_8bit(0x0A)
    lcd_write_8bit(0x00)
    lcd_write_reg(0xC3)
    lcd_write_8bit(0x8A)
    lcd_write_8bit(0x2A)
    lcd_write_reg(0xC4)
    lcd_write_8bit(0x8A)
    lcd_write_8bit(0xEE)
    // # VCOM
    lcd_write_reg(0xC5)
    lcd_write_8bit(0x0E)
    // # ST7735R Gamma Sequence
    lcd_write_reg(0xe0)
    lcd_write_8bit(0x0f)
    lcd_write_8bit(0x1a)
    lcd_write_8bit(0x0f)
    lcd_write_8bit(0x18)
    lcd_write_8bit(0x2f)
    lcd_write_8bit(0x28)
    lcd_write_8bit(0x20)
    lcd_write_8bit(0x22)
    lcd_write_8bit(0x1f)
    lcd_write_8bit(0x1b)
    lcd_write_8bit(0x23)
    lcd_write_8bit(0x37)
    lcd_write_8bit(0x00)
    lcd_write_8bit(0x07)
    lcd_write_8bit(0x02)
    lcd_write_8bit(0x10)
    lcd_write_reg(0xe1)
    lcd_write_8bit(0x0f)
    lcd_write_8bit(0x1b)
    lcd_write_8bit(0x0f)
    lcd_write_8bit(0x17)
    lcd_write_8bit(0x33)
    lcd_write_8bit(0x2c)
    lcd_write_8bit(0x29)
    lcd_write_8bit(0x2e)
    lcd_write_8bit(0x30)
    lcd_write_8bit(0x30)
    lcd_write_8bit(0x39)
    lcd_write_8bit(0x3f)
    lcd_write_8bit(0x00)
    lcd_write_8bit(0x07)
    lcd_write_8bit(0x03)
    lcd_write_8bit(0x10)
    // # Enable test command
    lcd_write_reg(0xF0)
    lcd_write_8bit(0x01)
    // # Disable ram power save mode
    lcd_write_reg(0xF6)
    lcd_write_8bit(0x00)
    // # 65k mode
    lcd_write_reg(0x3A)
    lcd_write_8bit(0x05)
    // # MX, MY, RGB mode
    lcd_write_reg(0x36)
    // # RGB color filter panel
    lcd_write_8bit(0xF7 & 0xA0)
    //  Sleep out
    lcd_write_reg(0x11)
    basic.pause(120)
    //  Turn on display
    lcd_write_reg(0x29)
}

function lcd_set_window(x1: number, y1: number, x2: number, y2: number) {
    lcd_write_reg(0x2A)
    lcd_write_8bit(0x00)
    lcd_write_8bit((x1 & 0xFF) + 1)
    lcd_write_8bit(0x00)
    lcd_write_8bit((x2 - 1 & 0xFF) + 1)
    lcd_write_reg(0x2B)
    lcd_write_8bit(0x00)
    lcd_write_8bit((y1 & 0xFF) + 1)
    lcd_write_8bit(0x00)
    lcd_write_8bit((y2 - 1 & 0xFF) + 1)
    lcd_write_reg(0x2C)
}

function lcd_set_color(color: number) {
    lcd_set_window(0, 0, LCD_WIDTH, LCD_HEIGHT)
    lcd_write_buf(color, LCD_WIDTH * LCD_HEIGHT)
}

function lcd_draw_rectangle(color: number, x1: number, y1: number, x2: number, y2: number) {
    let _: number;
    if (x2 < x1) {
        _ = x2
        x2 = x1
        x1 = _
    }
    
    if (y2 < y1) {
        _ = y2
        y2 = y1
        y2 = _
    }
    
    lcd_set_window(x1, y1, x2, y2)
    lcd_write_buf(color, (x2 - x1) * (y2 - y1))
}

lcd_init()
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    lcd_set_color(0)
})
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    MODE += 1
    MODE = MODE % 4
    basic.showNumber(MODE)
})
basic.forever(function on_forever() {
    let x: number;
    let y: number;
    if (MODE == 0) {
        lcd_set_color(randint(0, 65535))
    } else if (MODE == 1) {
        lcd_draw_rectangle(randint(0, 65535), randint(0, LCD_WIDTH), randint(0, LCD_HEIGHT), randint(0, LCD_WIDTH), randint(0, LCD_HEIGHT))
    } else if (MODE == 2) {
        x = randint(0, LCD_WIDTH)
        y = randint(0, LCD_HEIGHT)
        lcd_draw_rectangle(randint(0, 65535), x, y, x + 1, y + 1)
    } else {
        
        COLOR += 1
        lcd_set_color(COLOR)
    }
    
})
