//configurações gerais do jogo

var max_axle_x = 36;            //Distância máxima que o AVIÃO pode percorrer no eixo x
var min_axle_x = -max_axle_x;   //Distância mínima que o AVIÃO pode percorrer no eixo x

var max_axle_z = 80;            //Distância máxima que o AVIÃO pode percorrer no eixo z baseado na posição da câmera

var maxDistanceShot = max_axle_z;

var posInitPlayerX = 0;
var posInitPlayerY = 10;
var posInitPlayerZ = -20;

export { max_axle_x, min_axle_x, maxDistanceShot, posInitPlayerX, posInitPlayerY, posInitPlayerZ};
