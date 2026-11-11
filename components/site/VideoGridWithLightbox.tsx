'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Vis } from './Mockups';

export interface VideoItem {
  id: string;
  vimeoId: string;
  title: string;
  label?: string | null;
  client?: string | null;
  category?: string | null;
}

export default function VideoGridWithLightbox({
  videos,
  categories,
}: {
  videos: VideoItem[];
  categories: string[];
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxVideo, setLightboxVideo] = useState<VideoItem | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const filteredVideos = videos.filter((v) => {
    if (activeCategory === 'All') return true;
    return v.category === activeCategory;
  });

  // Handle escape key and focus trap
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxVideo) {
        setLightboxVideo(null);
      }
    };
    if (lightboxVideo) {
      document.documentElement.style.overflow = 'hidden';
      window.addEventListener('keydown', onKeyDown);
    } else {
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxVideo]);

  return (
    <>
      {/* Category filter */}
      <section
        className="dk wfil"
        style={{
          position: 'sticky',
          top: 'calc(76px + env(safe-area-inset-top, 0px))',
          zIndex: 5,
          borderBlock: '1px solid var(--line-d)',
          backgroundColor: 'var(--ink)',
        }}
      >
        <div className="in" style={{ paddingBlock: '14px' }}>
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              alignItems: 'center',
            }}
            role="group"
            aria-label="Filter by category"
          >
            {categories.map((cat) => {
              const isOn = activeCategory === cat;
              return (
                <button
                  key={cat}
                  className={`chip${isOn ? ' on' : ''}`}
                  type="button"
                  aria-pressed={isOn}
                  style={{ flex: 'none' }}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9:16 Video Grid */}
      <section className="dk">
        <div className="in sec">
          <div className="vgrid">
            {filteredVideos.map((v) => (
              <button
                key={v.id}
                className="vcard rv"
                type="button"
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
                onClick={() => setLightboxVideo(v)}
                aria-label={`Play video: ${v.title}`}
              >
                <div className="vthumb" style={{ position: 'relative' }}>
                  <Vis kind="vid" cls="r169" />
                </div>
                <div className="vbody">
                  <span className="xs mu">{v.label}</span>
                  <span className="sf h3">{v.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Accessible Video Lightbox */}
      {lightboxVideo && (
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label={lightboxVideo.title}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={(e) => {
            if (e.target === modalRef.current) setLightboxVideo(null);
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '900px',
              aspectRatio: '16/9',
              background: '#000',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            }}
          >
            <button
              type="button"
              onClick={() => setLightboxVideo(null)}
              aria-label="Close video"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 10,
                background: 'rgba(25,25,25,0.7)',
                color: 'var(--cream)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'grid',
                placeItems: 'center',
                fontSize: '20px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
            <iframe
              src={`https://player.vimeo.com/video/${lightboxVideo.vimeoId}?autoplay=1&badge=0&autopause=0&player_id=0&app_id=58479`}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={lightboxVideo.title}
            />
          </div>
        </div>
      )}
    </>
  );
}

