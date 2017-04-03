// import React, {Component} from 'React';

import './modal.css';

/**
 * templates
 */
const Template = [
	'<div class="react-modal-wrap" id="J_Modal">',
		'#TITLETEMPLATE#',
		'<div class="modal-body">',
			'<div class="modal-template">#TEMPLATE#</div>',
		'</div>',
		'<div class="modal-foot">',
			'#BTNTEMPLATE#',
		'</div>',
	'</div>'
].join('');
const T_doubleBtn = [
	'<div class="modal-button modal-button-l">#BTNLEFT#</div>',
	'<div class="modal-button modal-button-r">#BTNRIGHT#</div>'
].join('');
const T_singleBtn = '<div class="modal-button">#BTNTEXT#</div>';
const T_header = '<div class="model-head">#TITLE#</div>';
const T_mask = '<div class="modal-mask"></div>';

//tool functions
const _Tool = {
	insert: (html, showMask=true) => {
		const node = document.createElement('div');
		node.innerHTML = html+(showMask ? T_mask : '');
		document.body.appendChild(node);
	},
	noop: () => {}
}

//default options
const _defaultOptions = {
	title: '',
	content: '',
	mask: true,
	button: [
		{
			txt: 'cancel',
			cb: () => {}
		}, {
			txt: 'ok',
			cb: () => {}
		}
	]
};

// event type
const touchEvt = 'ontouchstart' in document ? 'touchstart' : 'click';

export default class Modal {

	constructor () {
		this.id = +new Date;
	}

	/**
	 * bind click events
	 */
	_bindEvents () {
		const modal = this.findModal();
		const $buttons = modal.querySelectorAll('.modal-button') || [];
		const {button} = this.options;
		let cbl, cbr, blen;

		//try get Button left callback
		try {
			blen = button.length;
			cbl = button[0].cb.bind(this);
		} catch (e) {
			console.error('Options.button should be an array with at least a Object');
		}
		//try get Button right callback
		try {
			cbr = button[1].cb.bind(this);
		} catch (e) {
			cbr = () => {};
		}

		if (blen === 2) {
			$buttons[0].addEventListener(touchEvt, cbl);
			$buttons[1].addEventListener(touchEvt, cbr);
		} else if (blen === 1) {
			$buttons[0].addEventListener(touchEvt, cbl);
		} else {
			//do nothing
		}

		this._removeEvents = () => {
			if (blen === 2) {
				$buttons[0].removeEventListener(touchEvt, cbl);
				$buttons[1].removeEventListener(touchEvt, cbr);
			} else if (blen === 1) {
				$buttons[0].removeEventListener(touchEvt, cbl);
			} else {
				//do nothing
			}
		}
	}

	/**
	 * create the html text for modal
	 */
	view () {
		const {content, mask, button} = this.options;
		const title = title ? T_header.replace('#TITLE#', title) : '';
		const blen = button.length || 0;
		let btnPanel;

		switch (blen) {
			case 2:
				btnPanel = (
					T_doubleBtn.replace('#BTNLEFT#', button[0].txt)
							   .replace('#BTNRIGHT#', button[1].txt)
				);
				break;
			case 1:
			default:
				btnPanel = T_singleBtn.replace('#BTNTEXT#', button[0].txt);
				break;
		}

		return (
			Template.replace('#BTNTEMPLATE#', btnPanel)
					.replace('#TEMPLATE#', content)
					.replace('#TITLETEMPLATE#', title)
					.replace('J_Modal', 'J_Modal_'+this.id)
		);
	}

	/**
	 * get the DOM of this modal
	 */
	findModal () {
		const id = 'J_Modal_'+this.id;
		return document.getElementById(id) || null;
	}

	/**
	 * hide model
	 */
	hide () {
		const modal = this.findModal();
		modal.style.display = 'none';
		this._removeEvents();
	}

	/**
	 * show modal with options
	 */
	show (options) {
		this.options = Object.assign({}, _defaultOptions, options);
		_Tool.insert(this.view(), this.options.mask);
		this._bindEvents();
	}

	/**
	 * remove the node of model
	 */
	destroy () {
		const modal = this.findModal();
		modal.remove();
	}

	/**
	 * alert event
	 */
	alert (content, cb) {
		this.show({
			content,
			button: [{
				txt: 'ok',
				cb: cb.bind(this)
			}]
		});
	}

	/**
	 * confirm event
	 */
	confirm (content, success=_Tool.noop, fail=_Tool.noop) {
		this.show({
			content,
			button: [{
				txt: 'ok',
				cb: success.bind(this)
			}, {
				txt: 'cancel',
				cb: fail.bind(this)
			}]
		});
	}
}