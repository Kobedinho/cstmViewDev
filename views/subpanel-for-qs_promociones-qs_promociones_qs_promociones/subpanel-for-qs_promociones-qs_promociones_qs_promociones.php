<?php
// created: 2016-01-06 18:08:23
$viewdefs['QS_Promociones']['base']['view']['subpanel-for-qs_promociones-qs_promociones_qs_promociones'] = array (
  'panels' => 
  array (
    0 => 
    array (
      'name' => 'panel_header',
      'label' => 'LBL_PANEL_1',
      'fields' => 
      array (
        0 => 
        array (
          'name' => 'num_folio',
          'label' => 'LBL_NUM_FOLIO',
          'enabled' => true,
          'default' => true,
        ),
        1 => 
        array (
          'label' => 'LBL_NAME',
          'enabled' => true,
          'default' => true,
          'name' => 'name',
          'link' => true,
        ),
        2 => 
        array (
          'name' => 'tipo_promocion',
          'label' => 'LBL_TIPO_PROMOCION',
          'enabled' => true,
          'default' => true,
        ),
        3 => 
        array (
          'name' => 'vigente_desde_c',
          'label' => 'LBL_VIGENTE_DESDE',
          'enabled' => true,
          'default' => true,
        ),
        4 => 
        array (
          'name' => 'vigente_hasta',
          'label' => 'LBL_VIGENTE_HASTA',
          'enabled' => true,
          'default' => true,
        ),
        5 => 
        array (
          'name' => 'activo',
          'label' => 'LBL_ACTIVO',
          'enabled' => true,
          'default' => true,
        ),
        6 => 
        array (
          'label' => 'LBL_DATE_MODIFIED',
          'enabled' => true,
          'default' => true,
          'name' => 'date_modified',
        ),
      ),
    ),
  ),
  'orderBy' => 
  array (
    'field' => 'date_modified',
    'direction' => 'desc',
  ),
  'type' => 'subpanel-list',
);