<?php
$module_name = 'QS_Promociones';
$viewdefs[$module_name] = 
array (
  'base' => 
  array (
    'view' => 
    array (
      'list' => 
      array (
        'panels' => 
        array (
          0 => 
          array (
            'label' => 'LBL_PANEL_1',
            'fields' => 
            array (
              0 => 
              array (
                'name' => 'name',
                'label' => 'LBL_NAME',
                'default' => true,
                'enabled' => true,
                'link' => true,
              ),
              1 => 
              array (
                'name' => 'num_folio',
                'label' => 'LBL_NUM_FOLIO',
                'enabled' => true,
                'default' => true,
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
                'name' => 'tipo_pago_multiple',
                'label' => 'tipo_pago_multiple',
                'enabled' => true,
                'default' => true,
              ),
              4 => 
              array (
                'name' => 'activo',
                'label' => 'LBL_ACTIVO',
                'enabled' => true,
                'default' => true,
              ),
              5 => 
              array (
                'name' => 'assigned_user_name',
                'label' => 'LBL_ASSIGNED_TO_NAME',
                'default' => true,
                'enabled' => true,
                'link' => true,
              ),
              6 => 
              array (
                'name' => 'date_modified',
                'enabled' => true,
                'default' => true,
              ),
              7 => 
              array (
                'name' => 'escala',
                'label' => 'LBL_ESCALA',
                'enabled' => true,
                'default' => true,
              ),
              8 => 
              array (
                'name' => 'date_entered',
                'enabled' => true,
                'default' => true,
              ),
              9 => 
              array (
                'name' => 'team_name',
                'label' => 'LBL_TEAM',
                'default' => false,
                'enabled' => true,
              ),
            ),
          ),
        ),
        'orderBy' => 
        array (
          'field' => 'date_modified',
          'direction' => 'desc',
        ),
      ),
    ),
  ),
);
