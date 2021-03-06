'use strict'

const Masonry = require('masonry-layout')

const qs = require('./querystring')



const gallery = document.getElementById('gallery')

const dom = (tag, props, content) => {
	const el = document.createElement(tag)
	for (let key in props) el.setAttribute(key, props[key])
	if (Array.isArray(content)) {
		for (let child of content) el.appendChild(child)
	} else if ('string' === typeof content) el.innerHTML = content
	return el
}



const matcher = (query) => (photo) => {
	for (let filter in query) {
		if (query[filter] !== photo[filter]) return false
	}
	return true
}



let photos = []

const setData = (newPhotos) => {
	photos = []
	for (let photo of newPhotos) {
		photo = Object.create(photo)
		photo.el = dom('a', {
			  class: 'picture'
			, href: photo.url
			, target: '_blank'
			, role: 'button'
			, 'aria-haspopup': 'true'
		}, [
			dom('img', {
				src: photo.thumb.url,
				width: photo.thumb.width,
				height: photo.thumb.height
			})
		])
		photos.push(photo)
	}
	applyQuery(qs.current)
}



const masonry = new Masonry(gallery, {
	itemSelector:       '#gallery .picture',
	fitWidth:           true,
	transitionDuration: 0
})

const applyQuery = (query) => {
	// gallery.childNodes is a NodeList, which does not support Symbol.iterator in every browser.
	for (let shown of Array.from(gallery.childNodes))
		gallery.removeChild(shown)

	const matches = matcher(query)
	const toBeShown = []
	for (let photo of photos) {
		if (matches(photo)) toBeShown.push(photo.el)
	}

	for (let el of toBeShown) gallery.appendChild(el)
	masonry.appended(toBeShown)
	masonry.reloadItems()
	masonry.layout()
}

module.exports = {setData, applyQuery}



// URL -> Gallery
qs.on('change', applyQuery)
