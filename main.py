LCD_SCL = DigitalPin.P13
LCD_SDA = DigitalPin.P15
LCD_RST = DigitalPin.P8
LCD_DC = DigitalPin.P12
LCD_CS = DigitalPin.P16
LCD_BLK = AnalogPin.P1

LCD_WIDTH = 160
LCD_HEIGHT = 128

MODE = 0
COLOR = 0

def set_cs(value):
    pins.digital_write_pin(LCD_CS, value)

def set_dc(value):
    pins.digital_write_pin(LCD_DC, value)

def lcd_write_reg(data):
    set_dc(0)
    set_cs(0)
    pins.spi_write(data)
    set_cs(1)

def lcd_write_8bit(data):
    set_dc(1)
    set_cs(0)
    pins.spi_write(data)
    set_cs(1)

def lcd_write_buf(data, count):
    set_dc(1)
    set_cs(0)
    for _ in range(count):
        pins.spi_write(data >> 8)
        pins.spi_write(data & 0xFF)
    set_cs(1)


def lcd_init():
    # start spi
    pins.spi_pins(LCD_SDA, DigitalPin.P14, LCD_SCL)
    pins.spi_write(0x00)
    # back light
    pins.analog_set_period(LCD_BLK, 20)
    # LCD_SPI_Init
    pins.spi_frequency(1000000)
    pins.spi_format(8, 0)
    set_cs(1)
    # LCD_Reset
    pins.digital_write_pin(LCD_RST, 1)
    basic.pause(100)
    pins.digital_write_pin(LCD_RST, 0)
    basic.pause(100)
    pins.digital_write_pin(LCD_RST, 1)
    # Initialize LCD register
    ## Frame Rate
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
    ## Column inversion
    lcd_write_reg(0xB4)
    lcd_write_8bit(0x07)
    # ST7735R Power Sequence
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
    ## VCOM
    lcd_write_reg(0xC5)
    lcd_write_8bit(0x0E)
    ## ST7735R Gamma Sequence
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
    ## Enable test command
    lcd_write_reg(0xF0)
    lcd_write_8bit(0x01)
    ## Disable ram power save mode
    lcd_write_reg(0xF6)
    lcd_write_8bit(0x00)
    ## 65k mode
    lcd_write_reg(0x3A)
    lcd_write_8bit(0x05)
    ## MX, MY, RGB mode
    lcd_write_reg(0x36)
    ## RGB color filter panel
    lcd_write_8bit(0xF7 & 0xA0)
    # Sleep out
    lcd_write_reg(0x11)
    basic.pause(120)
    # Turn on display
    lcd_write_reg(0x29)

def lcd_set_window(x1, y1, x2, y2):
    lcd_write_reg(0x2A)
    lcd_write_8bit(0x00)
    lcd_write_8bit((x1 & 0xFF) + 1)
    lcd_write_8bit(0x00)
    lcd_write_8bit(((x2 - 1) & 0xFF) + 1)
    lcd_write_reg(0x2B)
    lcd_write_8bit(0x00)
    lcd_write_8bit((y1 & 0xFF) + 1)
    lcd_write_8bit(0x00)
    lcd_write_8bit(((y2 - 1) & 0xFF) + 1)
    lcd_write_reg(0x2C)

def lcd_set_color(color):
    lcd_set_window(0, 0, LCD_WIDTH, LCD_HEIGHT)
    lcd_write_buf(color, LCD_WIDTH * LCD_HEIGHT)

def lcd_draw_rectangle(color, x1, y1, x2, y2):
    if x2 < x1:
        _ = x2
        x2 = x1
        x1 = _
    if y2 < y1:
        _ = y2
        y2 = y1
        y2 = _
    lcd_set_window(x1, y1, x2, y2)
    lcd_write_buf(color, (x2 - x1) * (y2 - y1))

def on_forever():
    if MODE == 0:
        lcd_set_color(randint(0, 65535))
    elif MODE == 1:
        lcd_draw_rectangle(randint(0, 65535), randint(0, LCD_WIDTH), randint(0, LCD_HEIGHT), randint(0, LCD_WIDTH), randint(0, LCD_HEIGHT))
    elif MODE == 2:
        x = randint(0, LCD_WIDTH)
        y = randint(0, LCD_HEIGHT)
        lcd_draw_rectangle(randint(0, 65535), x, y, x+1, y+1)
    else:
        global COLOR
        COLOR += 1
        lcd_set_color(COLOR)

def on_button_pressed_a():
    global MODE
    MODE += 1
    MODE = MODE % 4
    basic.show_number(MODE)

def on_button_pressed_b():
    lcd_set_color(0)

lcd_init()
input.on_button_pressed(Button.B, on_button_pressed_b)
input.on_button_pressed(Button.A, on_button_pressed_a)
basic.forever(on_forever)