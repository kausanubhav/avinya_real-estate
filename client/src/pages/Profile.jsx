import { useDispatch, useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase"
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signInFailure,
  signoutUserFailure,
  signoutUserStart,
  signoutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice"
import { Link } from "react-router-dom"
export default function Profile() {
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [listingError, setListingError] = useState(false)
  const [listings, setListings] = useState([])
  const { user } = useSelector((state) => state.user)
  const { currentUser, loading, error } = user
  const fileRef = useRef()
  const dispatch = useDispatch()

  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePerc(Math.round(progress))
      },
      (error) => setFileUploadError(true),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL })
        })
      }
    )
  }
  useEffect(() => {
    if (file) handleFileUpload(file)
  }, [file])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      console.log("data we got", data)
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }
  const handleDeleteUser = async (e) => {
    e.preventDefault()
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess())
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignout = async () => {
    try {
      dispatch(signoutUserStart())

      const res = await fetch("/api/auth/signout")
      const data = await res.json()
      if (data.success === false) return
      dispatch(signoutUserSuccess(data))
    } catch (error) {
      dispatch(signoutUserFailure(error.message))
    }
  }
  //Firebase storage
  //  allow read;
  //     allow write: if
  //     request.resource.size<2*1024*1024&&
  //     request.resource.contentType.matches('image/*')

  const handleShowListings = async () => {
    try {
      setListingError(false)
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json()
      if (data.success === false) {
        setListingError(false)
        return
      }
      setListings(data)
    } catch (error) {
      setListingError(true)
    }
  }
  const handleDeleteListing = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success === false) {
        console.log(data)
        return
      }

      setListings((prev) => prev.filter((listing) => listing._id !== id))
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="Profile image"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        {fileUploadError && (
          <span className="text-red-600 text-center">
            Error Image upload(image must be less than 2mb)
          </span>
        )}
        {!fileUploadError && filePerc > 0 && filePerc < 100 && (
          <span className="text-slate-700 text-center">Uploading {filePerc}%</span>
        )}
        {!fileUploadError && filePerc === 100 && (
          <span className="text-green-700 text-center">Image uploaded successfully!</span>
        )}
        <input
          onChange={handleInputChange}
          defaultValue={currentUser.username}
          type="text"
          placeholder="username"
          id="username"
          className="uppercase p-3 border rounded-lg"
        />
        <input
          onChange={handleInputChange}
          defaultValue={currentUser.email}
          type="text"
          placeholder="email"
          id="email"
          className="uppercase p-3 border rounded-lg"
        />
        <input
          onChange={handleInputChange}
          type="text"
          placeholder="password"
          id="password"
          className="uppercase p-3 border rounded-lg"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignout} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-700 font-semibold mt-5 text-center">{error ? error + "!" : ""}</p>
      <p className="text-green-700 font-semibold mt-5 text-center">
        {updateSuccess ? "Updated Successfully!" : ""}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full">
        {" "}
        Show Listings
      </button>
      <p className="text-red-700 mt-5">{listingError ? "Error showing listings" : ""}</p>
      {listings && listings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>
          {listings.map((listing) => (
            <div
              className="border rounded-lg p-3 flex gap-4 justify-between items-center "
              key={listing._id}
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain "
                />
              </Link>
              <Link
                className="flex-1 font-semibold text-slate-700 hover:underline truncate"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center ">
                <button
                  onClick={() => handleDeleteListing(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                <button  className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}{" "}
        </div>
      )}
    </div>
  )
}
