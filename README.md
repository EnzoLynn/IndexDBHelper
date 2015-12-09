# IndexDBHelper

```javascript


var IndexDBHelper = require('js/IndexDBHelper.js');
dbHelper = new IndexDBHelper(); 
 
dbHelper.openDatabase('test', 'table1', false, function(omes) {
			if (omes.success) { 
				dbHelper.find('table1', {
					content:'1'
				}, true, function(mes) {
			  if (mes.success) {
						me.setState({
						list: mes.result
			  });
	  	};
  	}); 
  };
});


dbHelper.add('table1', [{
	content: '1222'
}], function(ames) {
	if (ames.success) {
		dbHelper.find('table1', false, false, function(mes) {
			if (mes.success) {
				me.setState({
					list: mes.result
				});
			};
		});
	};
});

dbHelper.deleteById('table1', id, function(dmes) {
	if (dmes.success) {
		dbHelper.find('table1', false, false, function(mes) {
			if (mes.success) {
				me.setState({
					list: mes.result
				});
			};
		});
	};
});

dbHelper.updateById('table1', id, {
	content: '1update'
}, function(dmes) {
	if (dmes.success) {
		dbHelper.find('table1', false, false, function(mes) {
			if (mes.success) {
				me.setState({
					list: mes.result
				});
			};
		});
	};
});