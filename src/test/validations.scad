function plate_min_xy(plate_len, plate_wid, centered) = centered ? [-plate_len/2, -plate_wid/2] : [0, 0];
function plate_max_xy(plate_len, plate_wid, centered) = centered ? [ plate_len/2,  plate_wid/2] : [plate_len, plate_wid];

module validate_hole_placement(hole_xy, hole_diameter, plate_len, plate_wid, center_plate) {
    hole_r = hole_diameter/2;
    
    min_xy = plate_min_xy(plate_len, plate_wid, center_plate);
    max_xy = plate_max_xy(plate_len, plate_wid, center_plate);
    
    // Require the hole center to be at least its radius from each edge
    assert(hole_xy[0] >= min_xy[0] + hole_r, "Hole too close to left edge.");
    assert(hole_xy[0] <= max_xy[0] - hole_r, "Hole too close to right edge.");
    assert(hole_xy[1] >= min_xy[1] + hole_r, "Hole too close to bottom edge.");
    assert(hole_xy[1] <= max_xy[1] - hole_r, "Hole too close to top edge.");
} 