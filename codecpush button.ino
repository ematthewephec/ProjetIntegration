#include <LiquidCrystal.h>
#define BUTTON_PIN 8

int var;

const int rs = 2, en = 3, d4 = 4, d5 = 5, d6 = 6, d7 = 7; //pin écran
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);
byte lastButtonState = LOW;
byte ledState = LOW;
void setup() {

  pinMode(BUTTON_PIN, INPUT);

  lcd.begin(16, 2);
  lcd.clear();
        lcd.print("prototype démarré"); //mesage de bienvenue
}
void loop() {
  byte buttonState = digitalRead(BUTTON_PIN);
  if (buttonState != lastButtonState) {
    lastButtonState = buttonState;
    if (buttonState == LOW) { // en cas de bouton pressé.
      if (var == 3){
        var = 0;} // init de la variable principale
      else {var++;}
      if (var==0){ //lancement de la boucle de séléction
        lcd.clear();
        lcd.print("RAM: 33%");}
      else if (var==1){
        lcd.clear();
        lcd.print("CPU: 66%");}
      else if (var==2){
        lcd.clear();
        lcd.print("batterie: 88%");}
      else if (var==3){
        lcd.clear();
        lcd.print("SpdTst:100ms");}
        else {
      lcd.clear();
      lcd.print("error8888");} // test unitaire

    }
  }
}
