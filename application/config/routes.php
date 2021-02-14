<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	https://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There are three reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router which controller/method to use if those
| provided in the URL cannot be matched to a valid route.
|
|	$route['translate_uri_dashes'] = FALSE;
|
| This is not exactly a route, but allows you to automatically route
| controller and method names that contain dashes. '-' isn't a valid
| class or method name character, so it requires translation.
| When you set this option to TRUE, it will replace ALL dashes in the
| controller and method URI segments.
|
| Examples:	my-controller/index	-> my_controller/index
|		my-controller/my-method	-> my_controller/my_method
*/
$route['default_controller'] = 'Router';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;


$route['dashboard'] = 'Router';
$route['mapa'] = 'Router';
$route['login'] = 'Router';

$route['relatorios/posicoes'] = 'Router';


$route['cadastros/rastreador/lista'] = 'Router';
$route['cadastros/rastreador/novo'] = 'Router';
$route['cadastros/rastreador/editar/(:num)'] = 'Router/index/$1';

$route['cadastros/documento/lista'] = 'Router';
$route['cadastros/documento/novo'] = 'Router';
$route['cadastros/documento/editar/(:num)'] = 'Router/index/$1';

$route['cadastros/manutencao/lista'] = 'Router';
$route['cadastros/manutencao/novo'] = 'Router';
$route['cadastros/manutencao/editar/(:num)'] = 'Router/index/$1';

$route['cadastros/veiculo/lista'] = 'Router';
$route['cadastros/veiculo/novo'] = 'Router';
$route['cadastros/veiculo/editar/(:num)'] = 'Router/index/$1';

$route['cadastros/grupo_veiculo/lista'] = 'Router';
$route['cadastros/grupo_veiculo/novo'] = 'Router';
$route['cadastros/grupo_veiculo/editar/(:num)'] = 'Router/index/$1';

$route['cadastros/filial/lista'] = 'Router';
$route['cadastros/filial/novo'] = 'Router';
$route['cadastros/filial/editar/(:num)'] = 'Router/index/$1';

$route['cadastros/usuario/lista'] = 'Router';
$route['cadastros/usuario/novo'] = 'Router';
$route['cadastros/usuario/editar/(:num)'] = 'Router/index/$1';

$route['cadastros/locatario/lista'] = 'Router';
$route['cadastros/locatario/novo'] = 'Router';
$route['cadastros/locatario/editar/(:num)'] = 'Router/index/$1';

$route['ferramentas/instalacao/lista'] = 'Router';
$route['ferramentas/instalacao/novo'] = 'Router';
$route['ferramentas/instalacao/editar/(:num)'] = 'Router/index/$1';

$route['ferramentas/locacao/lista'] = 'Router';
$route['ferramentas/locacao/novo'] = 'Router';
$route['ferramentas/locacao/editar/(:num)'] = 'Router/index/$1';



