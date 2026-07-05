/**
 * Physical assumptions adopted by the simulation.
 *
 * These assumptions define the mathematical model before any numerical
 * integration or collision handling is applied.
 */

export const PhysicalAssumptions = Object.freeze({

  rigidBody: true,

  perfectlySphericalBall: true,

  constantGravity: true,

  uniformAirDensity: true,

  incompressibleAir: true,

  rigidBackboard: true,

  rigidRim: true,

  smallElasticDeformation: true,

  noPermanentDeformation: true,

  neglectEarthRotation: true,

  neglectRelativity: true,

  neglectHumidityEffects: true,

  neglectTemperatureVariation: true,

});