$(window).load(function () {
	$.getJSON('./cursed-plot.json', function (data) {
		$("#loadprogress").hide();
		/*var rent = data.map(item => { return { y: item.mp, x: new Date(item.dt) / 1000.0 } });
		var others = data.map(item => { return { y: item.mr, x: new Date(item.dt) / 1000.0 } });
		var sum = data.map(item => { return { y: item.mr + item.mp, x: new Date(item.dt) / 1000.0 } });*/
		const chart = c3.generate({
			bindto: '#chart',
			data: {
				x: 'x',
				columns: [
					['x', ...data.map(item => new Date(item.dt))],
					['rent', ...data.map(item => Number(item.mp))],
					['incomes', ...data.map(item => Number(item.mi))],
					['others', ...data.map(item => Number(item.mr))],
					['saldo', ...data.map(item => Number(item.sld))],
					['sum', ...data.map(item => Number(item.mp) + Number(item.mr) + Number(item.mi))]
					// ['rolling', ...data.map(item=>item.sum)],
				],
				names: {
					'rent': 'Rent, heating, power',
					'incomes': 'Incomes (memberships & other)',
					'others': 'Other expenses',
					'sum': 'Monthly balance',
					'saldo': 'Saldo',
				},
				axes: {
					'rent': 'y',
					'incomes': 'y',
					'others': 'y',
					'sum': 'y',
					'saldo': 'y2'
				},
				groups: [
					['rent', 'incomes', 'others']
				],
				type: 'bar',
				types: {
					sum: 'line',
					saldo: 'line'
				},
			},
			// subchart: {
			// 	show: true
			// },
			grid: {
				y: {
					lines: [{
						value: 0
					}, ],
				},
			},
			axis: {
				x: {
					type: 'timeseries',
					tick: {
						format: '%Y-%m'
					}
				},
				y: {
					tick: {
						format: function (d) {
						  return d3.format(",.2f")(d) + " zł";
						}
					  }
				},
				y2: {
					show: true,
					tick: {
						format: function (d) {
						  return d3.format(",.2f")(d) + " zł";
						}
					  }
				}
			}
		});

		//

	

	});

});