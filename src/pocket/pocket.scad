include <../paramsUniversal.scad>
include <paramsPocket.scad>

// Triangular prism: triangle in Z-X plane, extruded along Y
linear_extrude(height=size2Mm)
    polygon([[0,0], [sizeMm,0], [0,sizeMm]]);
