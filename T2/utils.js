export function distanceBetweenTwoPointsXZ(vector3D1, vector3D2){
    return Math.sqrt(
        Math.pow(
          vector3D1.x - vector3D2.x,
          2
        ) +
          Math.pow(
            vector3D1.z - vector3D2.z,
            2
          )
      );
}