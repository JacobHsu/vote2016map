function ColorBar(pt) {
  
	if(!pt){
		return {
			name: null,
			value: null
		}
	}

  var color = {
    name: pt,
    value: null
  }

  switch (color.name) {
    case '民主進步黨':
      color.value = 'green';
      break;
    case '中國國民黨':
      color.value = 'blue';
      break;
    case '時代力量':
      color.value = 'Gold';
      break;
    case '親民黨':
      color.value = 'orange';
      break;
    case '台灣團結聯盟':
      color.value = 'SaddleBrown';
      break;
    case '新黨':
      color.value = 'yellow';
      break;
    case '民國黨':
      color.value = 'Khaki';
      break;
    case '信心希望聯盟':
      color.value = 'Teal';  
      break;
    case '綠黨社會民主黨聯盟':
      color.value = 'LightGreen';  
      break;
    case '樹黨':
      color.value = 'LawnGreen';  
      break;
    default:
      color.value = 'LightGrey';
      break;
  }

  return color;
}
