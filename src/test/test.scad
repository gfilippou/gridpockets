pattern_x_count = 3;      // Number of plates in X direction
pattern_y_count = 5;      // Number of plates in Y direction

// Tunables
plate_len      = 20;     // X size of plate
plate_wid      = 30;      // Y size of plate
plate_thk      = 5;       // Z thickness

hole_diameter  = 8;      // Hole diameter
hole_xy        = [plate_len/2, plate_wid/2];
center_plate   = false;   // If true: hole_xy is relative to plate center
                          // If false: hole_xy is relative to lower-left corner

// Optional niceness
$fn = 96;                 // Smoothness for circles/cylinders

// Import validation functions
use <validations.scad>

// Validate hole placement
validate_hole_placement(hole_xy, hole_diameter, plate_len, plate_wid, center_plate);

// ---- Main model ----
module plate_with_hole(len, wid, thk, hole_d, hole_pos, centered=false) {
    difference() {
        // Plate
        translate(centered ? [-len/2, -wid/2, 0] : [0, 0, 0])
            cube([len, wid, thk], center=false);

        // Through-hole (add a little extra height so it always cuts)
        translate([hole_pos[0], hole_pos[1], -1])
            cylinder(h=thk+2, r=hole_d/2);
    }
}

// ---- Pattern generation ----
module plate_pattern(x_count, y_count, len, wid, thk, hole_d, hole_pos, centered=false) {
    union() {
        for (x = [0:x_count-1]) {
            for (y = [0:y_count-1]) {
                translate([x * len, y * wid, 0])
                    plate_with_hole(len, wid, thk, hole_d, hole_pos, centered);
            }
        }
    }
}

// Render the pattern
plate_pattern(pattern_x_count, pattern_y_count, plate_len, plate_wid, plate_thk, hole_diameter, hole_xy, center_plate);
