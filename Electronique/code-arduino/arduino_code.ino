#include <LiquidCrystal_I2C.h>
#define BUTTON_PIN 8

LiquidCrystal_I2C lcd(0x27, 16, 2);

int var = 0;
byte lastButtonState = LOW;
byte ledState = LOW;
char *data[4];

void setup()
{
  lcd.init();
  lcd.backlight();
  Serial.begin(19200);
}

void loop()
{

  while (Serial.available() > 0)
  {
    static char message[16];
    static unsigned int message_pos = 0;

    char inByte = Serial.read();
   
    if ( inByte != '\n')
    {
       message[message_pos] = inByte;
       message_pos++;
    }
    else
    {
        char *token = strtok(message, "-");
        int i = 0;
        
        while (token != NULL) {
            data[i++] = token;
            token = strtok(NULL, "-");
        }
        if (var==0){
          lcd.clear();
          char str[16];
          sprintf(str,"RAM = %s%c", data[0], 37);
          lcd.print(str);
        }
        else if (var==1){
          lcd.clear();
          char str[16];
          sprintf(str,"CPU = %s%c", data[1], 37);
          lcd.print(str);
        }
        else if (var==2){
          lcd.clear();
          char str[16];
          sprintf(str,"Batt = %s%c", data[2], 37);
          lcd.print(str);
        }
        else if (var==3){
          lcd.clear();
          char str[16];
          sprintf(str,"Stck = %s%c", data[3], 37);
          lcd.print(str);
        }
        message_pos = 0;
    }
  }
  byte buttonState = digitalRead(BUTTON_PIN);
  if (buttonState != lastButtonState) {
    lastButtonState = buttonState;
    if (buttonState == LOW) {
      if (var == 3){
        var = 0;}
      else {var++;}
      if (var==0){
        lcd.clear();
        char str[16];
        sprintf(str,"RAM = %s%c", data[0], 37);
        lcd.print(str);
        }
      else if (var==1){
        lcd.clear();
        char str[16];
        sprintf(str,"CPU = %s%c", data[1], 37);
        lcd.print(str);
      }
      else if (var==2){
        lcd.clear();
        char str[16];
        sprintf(str,"Batt = %s%c", data[2], 37);
        lcd.print(str);
      }
      else if (var==3){
        lcd.clear();
        char str[16];
        sprintf(str,"Stck = %s%c", data[3], 37);
        lcd.print(str);
      }
    }
  }
}
