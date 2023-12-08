import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { useState } from "react"
import { app } from "../firebase"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
export default function CreateListing() {
  const [files, setFiles] = useState([])
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  })
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageUploadError, setImageUploadError] = useState("")
  const [uploading, setUploading] = useState(false)
  const { user } = useSelector((state) => state.user)
  const { currentUser } = user
  const navigate=useNavigate()
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app)
      const fileName = new Date().getTime() + file.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(progress)
        },
        (error) => {
          reject(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl)
          })
        }
      )
    })
  }
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = []
      setUploading(true)
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]))
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) })
          setImageUploadError("")
          setUploading(false)
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)")
          setUploading(false)
        })
    } else {
      setImageUploadError("You can upload only 6 images per listing")
      setUploading(false)
    }
  }

  const handleRemoveImage = (index) => {
    setFormData({ ...formData, imageUrls: formData.imageUrls.filter((_, i) => i !== index) })
  }

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id })
    }

    if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
      setFormData({ ...formData, [e.target.id]: e.target.checked })
    }
    if (e.target.type === "number" || e.target.type === "text" || e.target.type === "textarea") {
      setFormData({ ...formData, [e.target.id]: e.target.value })
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (+formData.regularPrice < +formData.discountedPrice)
        return setError("Discount Price must be lower than regular price.")
      setLoading(true)
      setError(false)

      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      })
      const data = await res.json()
      setLoading(false)
      if (data.success === false) {
        setError(error.message)
        setLoading(false)
        return
      }
      navigate(`/listing/${data._id}`)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }
  console.log(formData)
  return (
    <main className="mx-auto max-w-4xl p-3">
      <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1 ">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength={60}
            minLength={10}
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="sale"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="rent"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="parking"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="furnished"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="offer"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                required
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="regularPrice"
                min={50}
                max={1000000}
                onChange={handleChange}
                value={formData.regularPrice}
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  className="p-3 border border-gray-300 rounded-lg"
                  type="number"
                  id="discountedPrice"
                  min={0}
                  max={10000}
                  required
                  onChange={handleChange}
                  value={formData.discountedPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image wil be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="images/*"
              multiple
              onChange={(e) => {
                setFiles(e.target.files)
                setImageUploadError("")
              }}
            />
            <button
              onClick={handleImageSubmit}
              disabled={uploading}
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && files.length > 0 && imageUploadError}
          </p>
          <p className="text-red-700 text-sm">
            {files.length === 0 && "Please select atleast one image for better visuals."}
          </p>

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div key={url} className="flex gap-2 justify-between p-3 border items-center">
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}

          <button disabled={uploading||loading} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-700 text-sm"> {error}</p>}
        </div>
      </form>
    </main>
  )
}
