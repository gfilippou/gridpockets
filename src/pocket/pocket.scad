include <../paramsUniversal.scad>
include <paramsPocket.scad>

module triangular_prism(width, height, depth) {
    linear_extrude(height=depth)
        polygon([[0,0], [width,0], [0,height]]);
}

triangular_prism(sizeMm, sizeMm, size2Mm);

translate([0, 0, size2Mm])
  triangular_prism(size2Mm, size2Mm, size2Mm);
