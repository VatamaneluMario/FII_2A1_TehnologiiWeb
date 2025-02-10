#include <8051.h>

unsigned char func (unsigned int x);

// citire tastatura
// cel mai bine de facut functie si apelata cand e nevoie
int main() {
    
    P3_3 = 1; //
    //  algem dispaly ul pe care afisam, 11-> primul din stanga
    P3_4 = 1; //
    
    while(1) {

    // citim ultimamlinie de keyboard
    // primi 4 registri P0.(0,1,2,3) se ocupa de linii
    // urmatori 4 registri de coloane

    P0 = 0b11111110; // coloana * 0 #
    if(P0_5 == 0){
        P1=~func(0);
    }

    P0 = 0b11111101;// coloana 7 8 9 
    if(P0_6 == 0){
        P1=~func(7);
    } if(P0_5 == 0){
        P1=~func(8);
    } if(P0_4 == 0){
        P1=~func(9);
    }

    P0 = 0b11111011; // coloana 4 5 6
    if(P0_6 == 0){
        P1=~func(4);
    } if(P0_5 == 0){
        P1=~func(5);
    } if(P0_4 == 0){
        P1=~func(6);
    }

    P0 = 0b11110111;
    if(P0_6 == 0){
        P1=~func(1);
    } if(P0_5 == 0){
        P1=~func(2);
    } if(P0_4 == 0){
        P1=~func(3);
    }
}
}

// functie afiseaza cifre la display
// apel: P1=~func(numar)
// P1 e pt display, la test poate sa fie diferit!!
unsigned char func (unsigned int x) {
    if (x == 0) {
        return 0b00111111;
    } else if (x == 1) {
        return 0b00000110;   
    } else if (x == 2) {
        return 0b01011011; 
    } else if (x == 3) {
        return 0b01001111;
    } else if (x == 4) {
        return 0b01100100; 
    } else if (x == 5) {
        return 0b01101101; 
    } else if (x == 6) {
        return 0b01111101; 
    } else if (x == 7) {
        return 0b00000111; 
    } else if (x == 8) {
        return 0b01111111; 
    } else if (x == 9) {
        return 0b01101111; 
    }

    return 0;
}
