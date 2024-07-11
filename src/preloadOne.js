export default function preloadOne(url, done) {
	const xhr = new XMLHttpRequest()
	xhr.open('GET', url, true)
	xhr.responseType = 'blob'

	const item = this.getItemByUrl(url)
	item.xhr = xhr
	
	xhr.onprogress = event => {
		if (!event.lengthComputable) return false
		item.completion = parseInt((event.loaded / event.total) * 100)
		item.downloaded = event.loaded
		item.total = event.total
		this.updateProgressBar(item)
	}
	xhr.onload = event => {
		const type = event.target.response.type
		const responseURL = event.target.responseURL

		item.fileName = responseURL.substring(responseURL.lastIndexOf('/') + 1)
		item.type = type
		item.status = xhr.status

		if (xhr.status == 404) {
			item.response = null
			item.error = true
			this.onerror(item)
		} else {
			item.response = event.target.response
			item.error = false
		}
		done(item)
	}
	xhr.send()
}