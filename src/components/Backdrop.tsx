// Page-wide ambient backdrop: drifting pastel blobs behind all content.
// Pure CSS animation (see .backdrop / .blob in globals.css), no client JS needed.
export default function Backdrop() {
    return (
        <div className="backdrop" aria-hidden>
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="blob blob-3" />
            <div className="blob blob-4" />
            <div className="blob blob-5" />
        </div>
    );
}
