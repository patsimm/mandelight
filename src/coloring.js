// generates color for given depth
module.exports = {
  multi: function(d) {
    const color = []
    color['r'] = ((Math.sin(d * 0.0125 + 30) + 1) / 2) * 255
    color['g'] = ((Math.sin(d * 0.01875) + 1) / 2) * 255
    color['b'] = ((Math.sin(d * 0.01875 + 60) + 1) / 2) * 255
    return color
  },
  rgb: function(d) {
    const color = []
    d = (d % 99) / 33
    if (d >= 2) {
      d -= 2
      color['r'] = d * 255
      color['g'] = 0
      color['b'] = (1 - d) * 255
      return color
    } else if (d >= 1) {
      d -= 1
      color['r'] = 0
      color['g'] = (1 - d) * 255
      color['b'] = d * 255
      return color
    } else if (d < 1) {
      color['r'] = (1 - d) * 255
      color['g'] = d * 255
      color['b'] = 0
      return color
    }
  },
  // "multi1" : function(d) {
  //     var color = [];
  //     color['r'] = (((d) % 3 + 1) * 30) % 255;
  //     color['g'] = (((d) % 3 + 1) * 60) % 255;
  //     color['b'] = (((d) % 3 + 1) * 140) % 255;
  //     return color;
  // },
}
