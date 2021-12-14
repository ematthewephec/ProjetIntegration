
INSERT INTO `pcs` (`idPc`, `idUser`, `test_date`, `user_name`, `processor`, `cpu_type`) VALUES
	(1, 7, '10/12/2021', 'test', 'ryzen 9', '5900X'),
	(2, 7, '10/11/2021', 'test', 'intel i7', '11900K');

INSERT INTO `battery` (`id`, `idPc`, `test_date`, `battery_percent`) VALUES
	(1, 1, '10/12/2021', '83'),
	(2, 1, '09/10/2021', '57'),
	(3, 1, '03/05/2020', '18'),
	(4, 1, '11/12/2021', '42');

INSERT INTO `cpu` (`id`, `idPc`, `test_date`, `cpu_percent`) VALUES
	(1, 1, '10/12/2021', 37),
	(2, 1, '08/10/2021', 48),
	(3, 1, '07/12/2020', 78);


INSERT INTO `ram` (`id`, `idPc`, `test_date`, `total_virtual`, `percent_virtual`, `total_swap`) VALUES
	(1, 1, '10/12/2021', '16GB', '43', '3GB'),
	(2, 1, '08/12/2021', '16GB', '54', '3GB'),
	(3, 1, '18/11/2021', '8GB', '62', '2GB'),
	(4, 1, '10/09/2021', '16GB', '81', '3GB'),
	(5, 1, '11/12/2021', '16GB', '67', '3GB'),
	(6, 1, '08/03/2020', '16GB', '32', '3GB');

INSERT INTO `storage` (`id`, `idPc`, `test_date`, `total_storage`, `used_storage`) VALUES
	(1, 1, '10/12/2021', '1500GB', '600GB'),
	(2, 1, '09/03/2021', '1500GB', '300GB'),
	(3, 1, '11/12/2021', '1500GB', '400GB');

