// ?       type:    {

//!                 normal: vai de cima para baixo
//!                 diagonal: vai da direita para a esquerda ou esquerda para diretia na diagonal, 
//!                     a direção depende de angleY, angles negativos esquerda para direita, positivos direita para esquerda
//!                 parable:  vai da direita para a esquerda ou esquerda para diretia em forma de parabola, 
//!                     a direção depende se o seu x inicial e positivo ou negativo
//!                 terrestrial: um lança missil que deve ser posicionado no chao
//?                 }
//!
//?         angleY  {

//!                 para os type (normal e diagonal) serve para rotacionar o avião durante a criação do objeto, considere um angleY de 0ª, 45ª ou -45ª, 
//!                     já para o em type(parable) e a rotação durante seu movimento considere angleY de 0.0025.Os terrestriais são virados para frete usando um angulo de 180ª APENAS SUGESTÃO

//?                 }
//?         posx    {

//!                 para types (normal) deve-se usar posx onde o player possa ir

//?                 }

export let enemys = {

  "-1": { type: "terrestrial", posx: -36, posy: 0, angleY: 180 },
  "-11": { type: "normal", posx: 0, posy: 10, angleY: 0 },
  "-12": { type: "normal", posx: 36, posy: 10, angleY: 0 },
  "-20": { type: "diagonal", posx: -80, posy: 10, angleY: 45 },
  "-21": { type: "diagonal", posx: 80, posy: 10, angleY: -45 },
  "-30": { type: "parable", posx: -80, posy: 10, angleY: 0.0025 },
  "-31": { type: "parable", posx: 80, posy: 10, angleY: 0.0025 },
  "-40": { type: "diagonal", posx: -60, posy: 10, angleY: 45 },
  "-41": { type: "diagonal", posx: 60, posy: 10, angleY: -45 },
  
};
