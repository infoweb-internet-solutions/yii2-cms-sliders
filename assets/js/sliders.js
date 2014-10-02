$(function() {

    $(document).on('click', '#batch-delete', function (event) {
        event.preventDefault();

        //var ids = $('#gridview-container').yiiGridView('getSelectedRows');
        var ids = [];

        $('#gridview-container').find("input[name='selection[]']:checked").each(function () {
            ids.push($(this).parent().closest('tr').data('key'));
        });

        // @todo Remove first ajax request and translate in javascript (available in version 2.1)
        $.ajax({
            url: 'multiple-delete-confirm-message',
            type: 'POST',
            data: {
                'ids': ids.length
            },
            success: function(message) {

                bootbox.confirm(message, function (confirmed) {
                    if (confirmed) {

                        $.ajax({
                            url: 'multiple-delete',
                            type: 'POST',
                            data: {
                                'ids': ids
                            },
                            success: function(data) {

                                if (data.status == 1)
                                {
                                    // Disable delete button
                                    $('#batch-delete').attr('disabled', true);

                                    // Success
                                    $.pjax.reload({container:'#grid-pjax'});

                                    // @todo Update message css
                                    $.growl({
                                        message: ' ' + data.message,
                                        icon: 'glyphicon glyphicon-ok-sign'
                                    }, {
                                        type: 'success'
                                    });

                                } else {
                                    // @todo Do somehting

                                    // Fail
                                    console.log('fail');
                                }
                            }
                        });
                    }
                });
            }
        });
    });

    $(document).on('change', "#gridview-container .kv-row-select input, .select-on-check-all", function (event) {

        //var itemsChecked = $('#gridview-container').yiiGridView('getSelectedRows').length;
        var itemsChecked = $('#gridview-container .kv-row-select input:checked').length;

        var disabled = true;

        if (itemsChecked > 0) {
            disabled = false;
        }

        $('#batch-delete').attr('disabled', disabled);

    });

});