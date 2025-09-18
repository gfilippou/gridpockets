// ===== Plate with Hole (Parametric) =====
// Pattern variables
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
use <assertions.scad>

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

/*
Quick tips:
- Set center_plate=true to position the hole from the plate center.
  Example: hole_xy = [0, 0] puts the hole dead center.
- Coordinates when center_plate=false:
  hole_xy = [0, 0] is the lower-left corner of the plate.
- Want rounded corners? Replace the cube with a rounded 2D rect + linear_extrude:

module rounded_plate(len, wid, thk, fillet=3) {
    linear_extrude(thk)
        offset(r=fillet)
            offset(r=-fillet)
                square([len, wid], center=true);
}

and in the difference() use:
translate([0,0,0]) rounded_plate(len, wid, thk, fillet=3);
(remember to keep centered placement consistent)
*/
