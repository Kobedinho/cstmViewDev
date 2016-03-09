<?php
$module_name = 'QS_Promociones';
$viewdefs[$module_name] = 
array (
  'base' => 
  array (
    'view' => 
    array (
      'record' => 
      array (
        'buttons' => array(
            array(
                'type' => 'button',
                'name' => 'cancel_button',
                'label' => 'LBL_CANCEL_BUTTON_LABEL',
                'css_class' => 'btn-invisible btn-link',
                'showOn' => 'edit',
            ),
            array(
                'type' => 'rowaction',
                'event' => 'button:save_button:click',
                'name' => 'save_button',
                'label' => 'LBL_SAVE_BUTTON_LABEL',
                'css_class' => 'btn btn-primary',
                'showOn' => 'edit',
                'acl_action' => 'edit',
            ),
            array(
                'type' => 'actiondropdown',
                'name' => 'main_dropdown',
                'primary' => true,
                'showOn' => 'view',
                'buttons' => array(
                    array(
                        'type' => 'rowaction',
                        'event' => 'button:edit_button:click',
                        'name' => 'edit_button',
                        'label' => 'LBL_EDIT_BUTTON_LABEL',
                        'acl_action' => 'edit',
                    ),
                    array(
                        'type' => 'rowaction',
                        'event' => 'button:configura_promocion:click',
                        'name' => 'configura_promocion',
                        'label' => 'Configurar promocion',//'LBL_CONFIGURA_PROMOCION_LABEL',
                        'acl_action' => '',
                    ),
                    array(
                        'type' => 'divider',
                    ),
                    array(
                        'type' => 'shareaction',
                        'name' => 'share',
                        'label' => 'LBL_RECORD_SHARE_BUTTON',
                        'acl_action' => 'view',
                    ),
                    array(
                        'type' => 'pdfaction',
                        'name' => 'download-pdf',
                        'label' => 'LBL_PDF_VIEW',
                        'action' => 'download',
                        'acl_action' => 'view',
                    ),
                    array(
                        'type' => 'pdfaction',
                        'name' => 'email-pdf',
                        'label' => 'LBL_PDF_EMAIL',
                        'action' => 'email',
                        'acl_action' => 'view',
                    ),
                    array(
                        'type' => 'divider',
                    ),
                    array(
                        'type' => 'rowaction',
                        'event' => 'button:find_duplicates_button:click',
                        'name' => 'find_duplicates_button',
                        'label' => 'LBL_DUP_MERGE',
                        'acl_action' => 'edit',
                    ),
                    array(
                        'type' => 'rowaction',
                        'event' => 'button:duplicate_button:click',
                        'name' => 'duplicate_button',
                        'label' => 'LBL_DUPLICATE_BUTTON_LABEL',
                        'acl_module' => $module,
                        'acl_action' => 'create',
                    ),
                    array(
                        'type' => 'rowaction',
                        'event' => 'button:audit_button:click',
                        'name' => 'audit_button',
                        'label' => 'LNK_VIEW_CHANGE_LOG',
                        'acl_action' => 'view',
                    ),
                    array(
                        'type' => 'divider',
                    ),
                    array(
                        'type' => 'rowaction',
                        'event' => 'button:delete_button:click',
                        'name' => 'delete_button',
                        'label' => 'LBL_DELETE_BUTTON_LABEL',
                        'acl_action' => 'delete',
                    ),
                ),
            ),
            array(
                'name' => 'sidebar_toggle',
                'type' => 'sidebartoggle',
            ),
        ),
        'last_state' => array(
            'id' => 'record_view',
            'defaults' => array(
                'show_more' => 'more'
            ),
        ),
        'panels' => 
        array (
          0 => 
          array (
            'name' => 'panel_header',
            'label' => 'LBL_RECORD_HEADER',
            'header' => true,
            'fields' => 
            array (
              0 => 
              array (
                'name' => 'picture',
                'type' => 'avatar',
                'width' => 42,
                'height' => 42,
                'dismiss_label' => true,
                'readonly' => true,
              ),
              1 => 'name',
              2 => 
              array (
                'name' => 'favorite',
                'label' => 'LBL_FAVORITE',
                'type' => 'favorite',
                'readonly' => true,
                'dismiss_label' => true,
              ),
              3 => 
              array (
                'name' => 'follow',
                'label' => 'LBL_FOLLOW',
                'type' => 'follow',
                'readonly' => true,
                'dismiss_label' => true,
              ),
            ),
          ),
          1 => 
          array (
            'newTab' => true,
            'panelDefault' => 'expanded',
            'name' => 'LBL_RECORDVIEW_PANEL5',
            'label' => 'LBL_RECORDVIEW_PANEL5',
            'columns' => 2,
            'labelsOnTop' => 1,
            'placeholders' => 1,
            'fields' => 
            array (
              0 => 
              array (
                'name' => 'tipo_promocion',
                'label' => 'LBL_TIPO_PROMOCION',
              ),
              1 => 
              array (
                'name' => 'tipo_pago_multiple',
                'label' => 'LBL_TIPO_PAGO_MULTIPLE',
              ),
              2 => 
              array (
                'name' => 'cualquiera_criterio_c',
                'label' => 'LBL_CUALQUIERA_CRITERIO',
              ),
              3 => 
              array (
                'name' => 'cualquiera_cantidad_c',
                'label' => 'LBL_CUALQUIERA_CANTIDAD',
              ),
              4 => 
              array (
                'name' => 'cualquiera_unidad_medida_c',
                'label' => 'LBL_CUALQUIERA_UNIDAD_MEDIDA',
              ),
              5 => 
              array (
                'name' => 'cualquiera_ycantidad_c',
                'label' => 'LBL_CUALQUIERA_YCANTIDAD',
              ),
              6 => 
              array (
                'name' => 'cualquiera_limitado_a_c',
                'label' => 'LBL_CUALQUIERA_LIMITADO_A',
              ),
              7 => 
              array (
              ),
              8 => 
              array (
                'name' => 'description',
                'comment' => 'Full text of the note',
                'label' => 'LBL_DESCRIPTION',
                'span' => 12,
              ),
            ),
          ),
          2 => 
          array (
            'newTab' => false,
            'panelDefault' => 'expanded',
            'name' => 'LBL_RECORDVIEW_PANEL3',
            'label' => 'LBL_RECORDVIEW_PANEL3',
            'columns' => 2,
            'labelsOnTop' => 1,
            'placeholders' => 1,
            'fields' => 
            array (
              0 => 
              array (
                'name' => 'vigente_desde_c',
                'label' => 'LBL_VIGENTE_DESDE',
              ),
              1 => 
              array (
                'name' => 'vigente_hasta',
                'label' => 'LBL_VIGENTE_HASTA',
              ),
              2 => 
              array (
                'name' => 'activo',
                'label' => 'LBL_ACTIVO',
              ),
              3 => 
              array (
              ),
            ),
          ),
          3 => 
          array (
            'newTab' => false,
            'panelDefault' => 'expanded',
            'name' => 'LBL_RECORDVIEW_PANEL4',
            'label' => 'LBL_RECORDVIEW_PANEL4',
            'columns' => 2,
            'labelsOnTop' => 1,
            'placeholders' => 1,
            'fields' => 
            array (
              0 => 
              array (
                'name' => 'acumulable',
                'label' => 'LBL_ACUMULABLE',
              ),
              1 => 
              array (
                'name' => 'obligatoria',
                'label' => 'LBL_OBLIGATORIA',
              ),
              2 => 
              array (
                'name' => 'escala',
                'label' => 'LBL_ESCALA',
              ),
              3 => 
              array (
                'name' => 'descuento_pago',
                'label' => 'LBL_DESCUENTO_PAGO',
              ),
              4 => 
              array (
                'name' => 'hasta_agotar_existencias_c',
                'label' => 'LBL_HASTA_AGOTAR_EXISTENCIAS',
              ),
              5 => 
              array (
                'name' => 'numero_aplicar',
                'label' => 'LBL_NUMERO_APLICAR',
              ),
              6 => 
              array (
                'name' => 'aplica_con_pe_c',
                'label' => 'LBL_APLICA_CON_PE',
              ),
              7 => 
              array (
              ),
            ),
          ),
          4 => 
          array (
            'newTab' => true,
            'panelDefault' => 'expanded',
            'name' => 'LBL_RECORDVIEW_PANEL6',
            'label' => 'LBL_RECORDVIEW_PANEL6',
            'columns' => 2,
            'labelsOnTop' => 1,
            'placeholders' => 1,
            'fields' => 
            array (
              0 => 
              array (
                'name' => 'todo_grupo_c',
                'label' => 'LBL_TODO_GRUPO',
              ),
              1 => 
              array (
              ),
              2 => 
              array (
                'name' => 'todas_companias_c',
                'label' => 'LBL_TODAS_COMPANIAS',
              ),
              3 => 
              array (
                'name' => 'region',
                'label' => 'LBL_REGION',
              ),
              4 => 
              array (
                'name' => 'todas_sucursales_c',
                'label' => 'LBL_TODAS_SUCURSALES',
              ),
              5 => 
              array (
                'name' => 'sucursal',
                'label' => 'LBL_SUCURSAL',
              ),
              6 => 
              array (
                'name' => 'todos_usuario_c',
                'label' => 'LBL_TODOS_USUARIO',
              ),
              7 => 
              array (
              ),
            ),
          ),
          5 => 
          array (
            'newTab' => false,
            'panelDefault' => 'expanded',
            'name' => 'LBL_RECORDVIEW_PANEL7',
            'label' => 'LBL_RECORDVIEW_PANEL7',
            'columns' => 2,
            'labelsOnTop' => 1,
            'placeholders' => 1,
            'fields' => 
            array (
              0 => 
              array (
                'name' => 'todos_canales_c',
                'label' => 'LBL_TODOS_CANALES',
              ),
              1 => 
              array (
                'name' => 'canal',
                'label' => 'LBL_CANAL',
              ),
              2 => 
              array (
                'name' => 'todos_subcanales_c',
                'label' => 'LBL_TODOS_SUBCANALES',
              ),
              3 => 
              array (
                'name' => 'sub_canal',
                'label' => 'LBL_SUB_CANAL',
              ),
              4 => 
              array (
                'name' => 'todos_giros_c',
                'label' => 'LBL_TODOS_GIROS',
              ),
              5 => 
              array (
                'name' => 'giro_canal',
                'label' => 'LBL_GIRO_CANAL',
              ),
            ),
          ),
          6 => 
          array (
            'newTab' => true,
            'panelDefault' => 'expanded',
            'name' => 'LBL_SHOW_MORE',
            'label' => 'LBL_SHOW_MORE',
            'columns' => 2,
            'labelsOnTop' => 1,
            'placeholders' => 1,
            'fields' => 
            array (
              0 => 
              array (
                'name' => 'num_folio',
                'label' => 'LBL_NUM_FOLIO',
              ),
              1 => 
              array (
              ),
              2 => 
              array (
                'name' => 'assigned_user_name',
                'label' => 'LBL_ASSIGNED_TO',
              ),
              3 => 
              array (
                'name' => 'team_name',
                'studio' => 
                array (
                  'portallistview' => false,
                  'portalrecordview' => false,
                ),
                'label' => 'LBL_TEAMS',
              ),
              4 => 
              array (
                'name' => 'date_modified_by',
                'label' => 'LBL_DATE_MODIFIED',
              ),
              5 => 
              array (
                'name' => 'date_entered_by',
                'label' => 'LBL_DATE_ENTERED',
              ),
            ),
          ),
        ),
        'templateMeta' => 
        array (
          'useTabs' => true,
        ),
      ),
    ),
  ),
);
