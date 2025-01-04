function lcd_write_reg(data: number) {
    set_dc(0)
    set_cs(0)
    pins.spiWrite(data)
    set_cs(1)
}

function lcd_set_color(color: number) {
    lcd_set_window(0, 0, LCD_WIDTH, LCD_HEIGHT)
    lcd_write_buf(color, LCD_WIDTH * LCD_HEIGHT)
}

function set_dc(value: number) {
    pins.digitalWritePin(LCD_DC, value)
}

input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    MODE += 1
    MODE = MODE % 5
    basic.showNumber(MODE)
})
function lcd_write_8bit(data2: number) {
    set_dc(1)
    set_cs(0)
    pins.spiWrite(data2)
    set_cs(1)
}

function lcd_init() {
    pins.spiPins(LCD_SDA, DigitalPin.P14, LCD_SCL)
    pins.spiWrite(0x00)
    pins.analogSetPeriod(LCD_BLK, 20)
    //  LCD_SPI_Init
    pins.spiFrequency(1000000)
    pins.spiFormat(8, 0)
    set_cs(1)
    pins.digitalWritePin(LCD_RST, 1)
    basic.pause(100)
    pins.digitalWritePin(LCD_RST, 0)
    basic.pause(100)
    pins.digitalWritePin(LCD_RST, 1)
    //  Initialize LCD register
    //  # Frame Rate
    lcd_write_reg(177)
    lcd_write_8bit(1)
    lcd_write_8bit(44)
    lcd_write_8bit(45)
    lcd_write_reg(178)
    lcd_write_8bit(1)
    lcd_write_8bit(44)
    lcd_write_8bit(45)
    lcd_write_reg(179)
    lcd_write_8bit(1)
    lcd_write_8bit(44)
    lcd_write_8bit(45)
    lcd_write_8bit(1)
    lcd_write_8bit(44)
    lcd_write_8bit(45)
    //  # Column inversion
    lcd_write_reg(180)
    lcd_write_8bit(7)
    //  ST7735R Power Sequence
    lcd_write_reg(192)
    lcd_write_8bit(162)
    lcd_write_8bit(2)
    lcd_write_8bit(132)
    lcd_write_reg(193)
    lcd_write_8bit(197)
    lcd_write_reg(194)
    lcd_write_8bit(10)
    lcd_write_8bit(0)
    lcd_write_reg(195)
    lcd_write_8bit(138)
    lcd_write_8bit(42)
    lcd_write_reg(196)
    lcd_write_8bit(138)
    lcd_write_8bit(238)
    //  # VCOM
    lcd_write_reg(197)
    lcd_write_8bit(14)
    //  # ST7735R Gamma Sequence
    lcd_write_reg(224)
    lcd_write_8bit(15)
    lcd_write_8bit(26)
    lcd_write_8bit(15)
    lcd_write_8bit(24)
    lcd_write_8bit(47)
    lcd_write_8bit(40)
    lcd_write_8bit(32)
    lcd_write_8bit(34)
    lcd_write_8bit(31)
    lcd_write_8bit(27)
    lcd_write_8bit(35)
    lcd_write_8bit(55)
    lcd_write_8bit(0)
    lcd_write_8bit(7)
    lcd_write_8bit(2)
    lcd_write_8bit(16)
    lcd_write_reg(225)
    lcd_write_8bit(15)
    lcd_write_8bit(27)
    lcd_write_8bit(15)
    lcd_write_8bit(23)
    lcd_write_8bit(51)
    lcd_write_8bit(44)
    lcd_write_8bit(41)
    lcd_write_8bit(46)
    lcd_write_8bit(48)
    lcd_write_8bit(48)
    lcd_write_8bit(57)
    lcd_write_8bit(63)
    lcd_write_8bit(0)
    lcd_write_8bit(7)
    lcd_write_8bit(3)
    lcd_write_8bit(16)
    //  # Enable test command
    lcd_write_reg(240)
    lcd_write_8bit(1)
    //  # Disable ram power save mode
    lcd_write_reg(246)
    lcd_write_8bit(0)
    //  # 65k mode
    lcd_write_reg(58)
    lcd_write_8bit(5)
    //  # MX, MY, RGB mode
    lcd_write_reg(54)
    //  # RGB color filter panel
    lcd_write_8bit(0xF7 & 0xA0)
    //  Sleep out
    lcd_write_reg(17)
    basic.pause(120)
    //  Turn on display
    lcd_write_reg(41)
}

function lcd_set_window(x1: number, y1: number, x2: number, y2: number) {
    lcd_write_reg(42)
    lcd_write_8bit(0)
    lcd_write_8bit((x1 & 0xFF) + 1)
    lcd_write_8bit(0)
    lcd_write_8bit((x2 - 1 & 0xFF) + 1)
    lcd_write_reg(43)
    lcd_write_8bit(0)
    lcd_write_8bit((y1 & 0xFF) + 1)
    lcd_write_8bit(0)
    lcd_write_8bit((y2 - 1 & 0xFF) + 1)
    lcd_write_reg(44)
}

input.onButtonPressed(Button.B, function on_button_pressed_b() {
    lcd_set_color(0)
})
function lcd_write_buf(data3: number, count: number) {
    set_dc(1)
    set_cs(0)
    for (let index = 0; index < count; index++) {
        pins.spiWrite(data3 >> 8)
        pins.spiWrite(data3 & 0xFF)
    }
    set_cs(1)
}

function set_cs(value2: number) {
    pins.digitalWritePin(LCD_CS, value2)
}

function lcd_draw_rectangle(color2: number, x12: number, y12: number, x22: number, y22: number) {
    let _2: number;
    if (x22 < x12) {
        _2 = x22
        x22 = x12
        x12 = _2
    }
    
    if (y22 < y12) {
        _2 = y22
        y22 = y12
        y22 = _2
    }
    
    lcd_set_window(x12, y12, x22, y22)
    lcd_write_buf(color2, (x22 - x12) * (y22 - y12))
}

let COLOR = 0
let MODE = 0
basic.showNumber(MODE)
let LCD_SCL = DigitalPin.P13
let LCD_SDA = DigitalPin.P15
let LCD_RST = DigitalPin.P8
let LCD_DC = DigitalPin.P12
let LCD_CS = DigitalPin.P16
let LCD_BLK = AnalogPin.P1
for (let pin of [LCD_SCL, LCD_SDA, LCD_RST, LCD_DC, LCD_CS]) {
    pins.setPull(pin, PinPullMode.PullDown)
}
let LCD_WIDTH = 160
let LCD_HEIGHT = 128
let X = 0
pins.spiFrequency(10000000)
lcd_init()
function rainbow(step: number) {
    let r: number;
    let g: number;
    let b: number;
    let y: number;
    
    //  16bit "565" color setting
    //  B 0 - 1f << 11
    //  G 0 - 3f << 5
    //  R 0 - 1f
    r = 0x1f
    g = 0
    b = 0
    for (g = 0; g < 0x3f; g++) {
        X += 1
        if (X > LCD_WIDTH) {
            X = 0
        }
        
        for (y = 0; y < LCD_HEIGHT; y++) {
            lcd_draw_rectangle(b << 11 | g * y / LCD_HEIGHT << 5 | r * y / LCD_HEIGHT, X, y, X + 1, y + step)
        }
    }
    g = 0x3f
    for (r = 0x1f; r < 0; r++) {
        X += 1
        if (X > LCD_WIDTH) {
            X = 0
        }
        
        for (y = 0; y < LCD_HEIGHT; y++) {
            lcd_draw_rectangle(b << 11 | g * y / LCD_HEIGHT << 5 | r * y / LCD_HEIGHT, X, y, X + 1, y + step)
        }
    }
    r = 0
    for (b = 0; b < 0x1f; b++) {
        X += 1
        if (X > LCD_WIDTH) {
            X = 0
        }
        
        for (y = 0; y < LCD_HEIGHT; y++) {
            lcd_draw_rectangle(b * y / LCD_HEIGHT << 11 | g * y / LCD_HEIGHT << 5 | r, X, y, X + 1, y + step)
        }
    }
    b = 0x1f
    for (g = 0x3f; g < 0; g++) {
        X += 1
        if (X > LCD_WIDTH) {
            X = 0
        }
        
        for (y = 0; y < LCD_HEIGHT; y++) {
            lcd_draw_rectangle(b * y / LCD_HEIGHT << 11 | g * y / LCD_HEIGHT << 5 | r, X, y, X + 1, y + step)
        }
    }
    g = 0
    for (r = 0; r < 0x1f; r++) {
        X += 1
        if (X > LCD_WIDTH) {
            X = 0
        }
        
        for (y = 0; y < LCD_HEIGHT; y++) {
            lcd_draw_rectangle(b * y / LCD_HEIGHT << 11 | g << 5 | r * y / LCD_HEIGHT, X, y, X + 1, y + step)
        }
    }
    r = 0x1f
    for (b = 0x1f; b < 0; b++) {
        X += 1
        if (X > LCD_WIDTH) {
            X = 0
        }
        
        for (y = 0; y < LCD_HEIGHT; y++) {
            lcd_draw_rectangle(b * y / LCD_HEIGHT << 11 | g << 5 | r * y / LCD_HEIGHT, X, y, X + 1, y + step)
        }
    }
    b = 0
}

function rainbowLine() {
    let r: number;
    let g: number;
    let b: number;
    
    //  16bit "565" color setting
    //  B 0 - 1f << 11
    //  G 0 - 3f << 5
    //  R 0 - 1f
    r = 0x1f
    g = 0
    b = 0
    for (g = 0; g < 0x3f; g += 1) {
        X += 1
        if (X > LCD_WIDTH) {
            X = 0
        }
        
        lcd_draw_rectangle(b << 11 | g << 5 | r, X, 0, X + 1, LCD_HEIGHT)
    }
    g = 0x3f
    for (r = 0x1f; r > 0; r += -1) {
        X += 1
        if (X > LCD_WIDTH) {
            X = 0
        }
        
        lcd_draw_rectangle(b << 11 | g << 5 | r, X, 0, X + 1, LCD_HEIGHT)
    }
    r = 0
    for (b = 0; b < 0x1f; b += 1) {
        X += 1
        if (X > LCD_WIDTH) {
            X = 0
        }
        
        lcd_draw_rectangle(b << 11 | g << 5 | r, X, 0, X + 1, LCD_HEIGHT)
    }
    b = 0x1f
    for (g = 0x3f; g > 0; g += -1) {
        X += 1
        if (X > LCD_WIDTH) {
            X = 0
        }
        
        lcd_draw_rectangle(b << 11 | g << 5 | r, X, 0, X + 1, LCD_HEIGHT)
    }
    g = 0
    for (r = 0; r < 0x1f; r += 1) {
        X += 1
        if (X > LCD_WIDTH) {
            X = 0
        }
        
        lcd_draw_rectangle(b << 11 | g << 5 | r, X, 0, X + 1, LCD_HEIGHT)
    }
    r = 0x1f
    for (b = 0x1f; b > 0; b += -1) {
        X += 1
        if (X > LCD_WIDTH) {
            X = 0
        }
        
        lcd_draw_rectangle(b << 11 | g << 5 | r, X, 0, X + 1, LCD_HEIGHT)
    }
    b = 0
}

basic.forever(function on_forever() {
    let x: number;
    let y: number;
    
    if (MODE == 0) {
        lcd_set_color(randint(0, 65535))
    } else if (MODE == 1) {
        x = randint(0, LCD_WIDTH)
        y = randint(0, LCD_HEIGHT)
        lcd_draw_rectangle(randint(0, 65535), x, y, x + 1, y + 1)
    } else if (MODE == 2) {
        lcd_draw_rectangle(randint(0, 65535), randint(0, LCD_WIDTH), randint(0, LCD_HEIGHT), randint(0, LCD_WIDTH), randint(0, LCD_HEIGHT))
    } else if (MODE == 3) {
        rainbowLine()
    } else if (MODE == 4) {
        rainbow(1)
    } else {
        COLOR += 1
        lcd_set_color(COLOR)
    }
    
})
