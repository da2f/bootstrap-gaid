/* ==========================================================
 * bootstrap-gaid.js v0.0.1
 * url
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;

  var $win = $(window)
    , $topPan = $()//$(document.createElement("div")).appendTo(document.body).addClass("gaid-backdrop gaid-backdrop-top").css("display", "none")
    , $leftPan = $()//$(document.createElement("div")).appendTo(document.body).addClass("gaid-backdrop gaid-backdrop-left").css("display", "none")
    , $rightPan = $()//$(document.createElement("div")).appendTo(document.body).addClass("gaid-backdrop gaid-backdrop-right").css("display", "none")
    , $bottomPan = $()//$(document.createElement("div")).appendTo(document.body).addClass("gaid-backdrop gaid-backdrop-bottom").css("display", "none")
    , $target = $(document.createElement("div")).appendTo(document.body).addClass("gaid-target").css("display", "none")

 /* GUID CLASS DEFINITION
  * ====================== */

  var Gaid = function (element, gaid, options) {
    this.options = $.extend({}, $.fn.gaid.defaults, options, $(element).data())
    //$win
    //  .on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
    //  .on('click.affix.data-api',  $.proxy(function () { setTimeout($.proxy(this.checkPosition, this), 1) }, this))
    this.gaid = gaid
    this.$element = $(element)
  }

  Gaid.prototype.getNext = function ($o, gaid) {
    var $items = $('[data-gaid-id=' + gaid + ']')
      , ind
    ind = $items.length
    while (ind--) {
      if ($($items[ind]).is($o)) {
        return $($items[ind + 1]).length > 0 ? $($items[ind + 1]) : null
      }
    }
    return null
  }

  Gaid.prototype.getPrev = function ($o, gaid) {
    var $items = $('[data-gaid-id=' + gaid + ']')
      , ind
    ind = $items.length
    while (ind--) {
      if ($($items[ind]).is($o)) {
        return $($items[ind - 1]).length > 0 ? $($items[ind - 1]) : null
      }
    }
    return null
  }

  Gaid.prototype.showBackdrop = function ($o) {
    var shift = 10
      , offset = $o.offset()
      , width = $o.outerWidth()
      , height = $o.outerHeight()
      , val

    $topPan.css({width: 'auto', height: (val = offset.top - shift) < 0 ? 0 : val, top: 0, right: 0, bottom: 'auto', left: 0}).show()
    $leftPan.css({width: (val = offset.left - shift) < 0 ? 0 : val, height: 'auto', top: (val = offset.top - shift) < 0 ? 0 : val, right: 'auto', bottom: 0, left: 0}).show()
    $rightPan.css({width: 'auto', height: 'auto', top: (val = offset.top - shift) < 0 ? 0 : val, right: 0, bottom: 0, left: (val = offset.left + width + shift) < 0 ? 0 : val}).show()
    $bottomPan.css({width: (val = width + shift + shift) < 0 ? 0 : val, height: 'auto', top: (val = offset.top + height + shift) < 0 ? 0 : val, right: 'auto', bottom: 0, left: (val = offset.left - shift) < 0 ? 0 : val}).show()
  }

  Gaid.prototype.showTarget = function ($o) {
    var isFixed = (function ($o) {do {if ($o.css('position') === 'fixed') return true} while (($o = $o.parent()).length > 0 && !$o.is(document)) return false})($o)
      , offset = $o.offset()
      , width = $o.outerWidth()
      , height = $o.outerHeight()
      , pos = (this.options.gaidPlacement || this.options.placement) === 'auto' ? [{pos: 'top', dig: $topPan.height()}, {pos: 'right', dig: $rightPan.width()}, {pos: 'bottom', dig: $bottomPan.height()}, {pos: 'left', dig: $leftPan.width()}].sort(function (a, b) {return a.dig === b.dig ? 0 : a.dig > b.dig ? -1 : 1})[0].pos : (this.options.gaidPlacement || this.options.placement)
      , $tip, css, data

    isFixed = $o.hasClass('affix-top') ? true : isFixed
    if (isFixed) {
        offset.top -= $win.scrollTop()
        offset.left -= $win.scrollLeft()
    }

    switch (pos) {
      case 'top':
        css = {left: offset.left + (width >> 1), top: offset.top}
        break
      case 'right':
        css = {left: offset.left + width, top: offset.top + (height >> 1)}
        break
      case 'bottom':
        css = {left: offset.left + (width >> 1), top: offset.top + height}
        break
      case 'left':
        css = {left: offset.left, top: offset.top + (height >> 1)}
        break
    }

    $target.css(css).css('position', isFixed ? 'fixed' : 'absolute').show()
    $target.popover('destroy').popover({
      html: true,
      placement: pos,
      trigger: 'manual',
      title: '<button class="close" data-dismiss="gaid">&times;</button>' + (this.options.gaidTitle || this.options.title),
      content: [
        '<p>' + (this.options.gaidContent || this.options.content) + '</p>',
        '<div class="clearfix">',
          '<div class="btn-group pull-right">',
            this.getPrev($o, this.gaid) ? '<button class="btn btn-mini gaid-prev">&laquo;&nbsp;' + this.options.labelPrev + '</button>' : '',
            this.getNext($o, this.gaid) ? '<button class="btn btn-mini gaid-next">' + this.options.labelNext + '&nbsp;&raquo;</button>' : '',
          '</div>',
        '</div>'
      ].join('')
    }).popover('show').css('position', isFixed ? 'fixed' : 'absolute')
    data = $target.data('popover')
    $tip = data && data.$tip || null
    if (isFixed) {
        $tip && $tip.css({'position': 'fixed', 'left': parseFloat($tip.css('left')) - $win.scrollLeft(), 'top': parseFloat($tip.css('top')) - $win.scrollTop()})
    }
    $tip && $tip.addClass('gaid-popover')
      .on('click.gaid', 'button.gaid-prev', $.proxy(this.prevStep, this))
      .on('click.gaid', 'button.gaid-next', $.proxy(this.nextStep, this))
      .delegate('[data-dismiss="gaid"]', 'click.dismiss.gaid', $.proxy(this.hide, this))
  }

  Gaid.prototype.hideEls = function () {
    $target.popover('destroy')
    $($topPan).add($leftPan).add($rightPan).add($bottomPan).add($target).hide()
  }

  Gaid.prototype.show = function () {
    var that = this
    this.hideEls()
    this.showBackdrop(this.$element)
    setTimeout(function () {
      that.showTarget(that.$element)
    }, 500)
  }

  Gaid.prototype.hide = function () {
    this.hideEls()
  }

  Gaid.prototype.prevStep = function (evt) {
    var $o = this.getPrev(this.$element, this.gaid)
    $o && $o.length > 0 && $o.data('gaid').show()
  }

  Gaid.prototype.nextStep = function (evt) {
    var $o = this.getNext(this.$element, this.gaid)
    $o && $o.length > 0 && $o.data('gaid').show()
  }

 /* GAID PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.gaid

  $.fn.gaid = function (option) {
    var gaidId = '' + Math.round(Math.random() * 9000) + Math.round(Math.random() * 9000)
    return this
        .each(function () {
          !$(this).data('gaidId') && $(this).attr('data-gaid-id', gaidId)
        })
        .each(function (ind) {
          var $this = $(this)
            , gaid = $this.data('gaidId')
            , data = $this.data('gaid')
            , options = typeof option == 'object' && option
          if (!data) {
            $this.data('gaid', (data = new Gaid(this, gaid, options)))
          }

          if (typeof option == 'string') {
            data[option]()
          } else {
            ind === 0 && data.show()
          }
        })
  }

  $.fn.gaid.Constructor = Gaid

  $.fn.gaid.defaults = {
    placement: 'auto',
    title: '&nbsp;',
    content: '&nbsp;',
    labelPrev: 'Previous',
    labelNext: 'Next'
  }

 /* GAID NO CONFLICT
  * ================= */

  $.fn.gaid.noConflict = function () {
    $.fn.gaid = old
    return this
  }
}(jQuery);