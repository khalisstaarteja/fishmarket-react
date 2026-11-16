"use client";

import Hero from "@/components/Hero";
import Title from "@/components/Title";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { GalleryItem } from "@/app/data/dataGallery";
import GalleryCard from "@/components/GalleryCard";
import { getGalleryItems } from "@/lib/gallery";
import { getContent } from "@/lib/content";
import { getDefaultContent } from "@/app/data/dataContent";

export default function Gallery() {
  const [content, setContent] = useState(getDefaultContent());
  useEffect(() => {
      setContent(getContent());
  
      const handleUpdate = () => {
        setContent(getContent());
      };
      window.addEventListener("contentUpdated", handleUpdate);
      return () => window.removeEventListener("contentUpdated", handleUpdate);
    }, []);
    
  const [items, setItems] = useState<GalleryItem[]>([]);
  // state 'filter' untuk melacak kategori apa yang sedang aktif (Semua, Foto, atau Video)
  // nilai default-nya adalah "all" 
  const [filter, setFilter] = useState<"all" | "photo" | "video">("all");

  // state 'lightboxItem' untuk menyimpan data gambar/video mana yang sedang di-klik
  // jika nilainya null, berarti modal (pop-up) sedang tertutup
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  // dipanggil untuk menutup pop-up modal dengan cara mengembalikan nilainya ke null.
  const handleClose = () => setLightboxItem(null);

  useEffect(() => {
    setItems(getGalleryItems());
    const handleUpdate = () => setItems(getGalleryItems());

    window.addEventListener("galleryUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate); // sinkron antar tab

    return () => {
      window.removeEventListener("galleryUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);
  // sebelum ditampilin, data asli (galleryData) difilter dulu
  const filteredData = items.filter((item) => {
    if (filter === "all") return true; // jika "all", tampilkan semua data
    return item.type === filter; // jika tidak, cocokkan tipe data dengan filter aktif
  });

  return (
    <>
      <title>Galeri | Muara Baru</title>
      <Hero
        videoSrc="/videos/gallery.mp4"
        title={content.galeriTitle}
        sub={content.galeriSub}
        buttonText="Lihat Galeri"
        buttonLink="content"
      />

      <Container className="my-5" id="content">
        <Title
          title={content.galeriTitle2}
          sub={content.galeriSub2}
        />

        <div className="pure-css-gallery">
          <div className="gallery-filter d-flex justify-content-center gap-3 mb-4">
            <Button
              variant={filter === "all" ? "warning" : "light"}
              className={`filter-btn rounded-pill px-4 ${filter === "all" ? "active-filter fw-bold" : "text-primary"}`}
              onClick={() => setFilter("all")}
            >
              Semua
            </Button>
            <Button
              variant={filter === "photo" ? "warning" : "light"}
              className={`filter-btn rounded-pill px-4 ${filter === "photo" ? "active-filter fw-bold" : "text-primary"}`}
              onClick={() => setFilter("photo")}
            >
              Foto
            </Button>
            <Button
              variant={filter === "video" ? "warning" : "light"}
              className={`filter-btn rounded-pill px-4 ${filter === "video" ? "active-filter fw-bold" : "text-primary"}`}
              onClick={() => setFilter("video")}
            >
              Video
            </Button>
          </div>

          <Row className="g-4">
            {filteredData.map((item) => (
              <Col xs={12} md={6} lg={4} key={item.id}>
                <GalleryCard
                  item={item}
                  onSelect={(selected: GalleryItem) =>
                    setLightboxItem(selected)
                  }
                />
              </Col>
            ))}
          </Row>
          <Modal
            show={lightboxItem !== null}
            onHide={handleClose}
            centered
            size="lg"
          >
            <Modal.Header closeButton className="border-0 bg-white">
              <Modal.Title>{lightboxItem?.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="bg-dark text-center p-0">  
              {lightboxItem?.type === "photo" ? (
                // jika foto: render tag <img>
                <img
                  src={lightboxItem?.src}
                  alt={lightboxItem?.title}
                  className="img-fluid w-100 image-contain"
                  style={{ maxHeight: "80vh" }}
                />
              ) : (
                // jika video: render tag <iframe> dengan rasio layar 16:9
                <div className="ratio ratio-16x9">
                  <iframe
                    src={lightboxItem?.src}
                    title={lightboxItem?.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </Modal.Body>
          </Modal>
        </div>
      </Container>
    </>
  );
}
