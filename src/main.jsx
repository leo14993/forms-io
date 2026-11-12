import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

const shapes = [
  { id: 'circle', label: 'Círculo', icon: 'circle' },
  { id: 'square', label: 'Quadrado', icon: 'square' },
  { id: 'triangle', label: 'Triângulo', icon: 'triangle' },
  { id: 'star', label: 'Estrela', icon: 'star' },
]

const colors = [
  { name: 'Coral', value: '#f47c68' },
  { name: 'Amarelo', value: '#f5c84c' },
  { name: 'Verde', value: '#71b98a' },
  { name: 'Azul', value: '#6ba9db' },
  { name: 'Lilás', value: '#a18ad4' },
  { name: 'Rosa', value: '#e989b2' },
  { name: 'Laranja', value: '#ed9b56' },
  { name: 'Turquesa', value: '#57b9b2' },
  { name: 'Grafite', value: '#52535a' },
  { name: 'Branco', value: '#ffffff' },
]

function Shape({ type, color }) {
  if (type === 'circle') {
    return <div className="shape shape-circle" style={{ backgroundColor: color }} />
  }
  if (type === 'square') {
    return <div className="shape shape-square" style={{ backgroundColor: color }} />
  }
  if (type === 'triangle') {
    return (
      <svg className="shape shape-triangle" viewBox="0 0 180 160" aria-hidden="true">
        <path d="M90 8 174 152H6L90 8Z" fill={color} />
      </svg>
    )
  }
  return (
    <svg className="shape shape-star" viewBox="0 0 180 180" aria-hidden="true">
      <path
        d="m90 8 20.1 48.5 52.3 4.2-39.9 34 12.4 51-44.9-27.6-44.9 27.6 12.4-51-39.9-34 52.3-4.2L90 8Z"
        fill={color}
      />
    </svg>
  )
}

function ShapeIcon({ type }) {
  if (type === 'triangle') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 4 9 16H3L12 4Z" /></svg>
  }
  if (type === 'star') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" /></svg>
  }
  return <span className={`tool-shape tool-${type}`} aria-hidden="true" />
}

function App() {
  const [selectedShape, setSelectedShape] = useState('circle')
  const [selectedColor, setSelectedColor] = useState(colors[0].value)
  const [shapeVisible, setShapeVisible] = useState(true)
  const [rotation, setRotation] = useState(0)
  const [image, setImage] = useState(null)

  const currentShape = shapes.find((shape) => shape.id === selectedShape)
  const currentColor = colors.find((color) => color.value === selectedColor)?.name ?? 'Personalizada'

  useEffect(() => {
    return () => {
      if (image?.url) URL.revokeObjectURL(image.url)
    }
  }, [image])

  function addImage(event) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return
    if (!file.type.startsWith('image/')) {
      window.alert('Escolha um arquivo de imagem para adicionar à prancheta.')
      return
    }

    setImage({ name: file.name, url: URL.createObjectURL(file) })
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Forma, início">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>forma<span className="brand-period">.</span></span>
        </a>
        <div className="topbar-center">
          <span className="document-dot" />
          <span>Meu primeiro desenho</span>
          <span className="saved-label">Salvo agora</span>
        </div>
        <button className="share-button" type="button" onClick={() => window.alert('Seu desenho está pronto para compartilhar!')}>
          Compartilhar <span aria-hidden="true">↗</span>
        </button>
      </header>

      <div className="workspace">
        <aside className="left-rail" aria-label="Ferramentas">
          <div className="rail-section">
            <p className="eyebrow">FORMAS</p>
            <div className="shape-tools">
              {shapes.map((shape) => (
                <button
                  className={`shape-tool${selectedShape === shape.id ? ' active' : ''}`}
                  key={shape.id}
                  type="button"
                  aria-label={shape.label}
                  aria-pressed={selectedShape === shape.id}
                  onClick={() => {
                    setSelectedShape(shape.id)
                    setShapeVisible(true)
                  }}
                >
                  <ShapeIcon type={shape.icon} />
                </button>
              ))}
            </div>
          </div>
          <div className="rail-bottom">
            <span className="help-mark" aria-hidden="true">?</span>
            <span className="help-label">Precisa de ajuda?</span>
          </div>
        </aside>

        <section className="canvas-area" aria-label="Área de desenho">
          <div className="canvas-heading">
            <div>
              <p className="eyebrow">ÁREA DE CRIAÇÃO</p>
              <h1>Um mundo de formas<span>.</span></h1>
              <p className="canvas-subtitle">Escolha uma forma, encontre sua cor e deixe a imaginação fluir.</p>
            </div>
            <button className="canvas-menu" type="button" aria-label="Mais opções">•••</button>
          </div>

          <div className="canvas-frame">
            <div className="canvas-paper">
              <div className="paper-label"><span /> PRANCHETA 01</div>
              {shapeVisible ? (
                <button
                  className="shape-on-canvas"
                  type="button"
                  aria-label={`${currentShape.label} ${currentColor.toLowerCase()}`}
                  onClick={() => setShapeVisible(false)}
                  title="Clique para remover a forma"
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  <Shape type={selectedShape} color={selectedColor} />
                </button>
              ) : (
                <button className="empty-canvas" type="button" onClick={() => setShapeVisible(true)}>
                  <span className="empty-plus">+</span>
                  <span>Adicionar forma</span>
                </button>
              )}
              {image && (
                <div className="image-on-canvas">
                  <img src={image.url} alt={image.name} style={{ transform: `rotate(${rotation}deg)` }} />
                  <button type="button" aria-label="Remover imagem da prancheta" onClick={() => setImage(null)}>×</button>
                </div>
              )}
              <div className="paper-caption">
                <span>01</span>
                <span>feito com carinho</span>
              </div>
            </div>
            <div className="canvas-footer">
              <span><span className="status-dot" /> Pronto para criar</span>
              <span>100%</span>
            </div>
          </div>
          <div className="tip-card">
            <span className="tip-sparkle" aria-hidden="true">✳</span>
            <p><strong>Dica de artista</strong><br />Clique na forma para removê-la. Escolha outra para começar de novo!</p>
          </div>
        </section>

        <aside className="properties-panel" aria-label="Personalizar forma">
          <div className="panel-title-row">
            <div>
              <p className="eyebrow">PERSONALIZE</p>
              <h2>Sua forma</h2>
            </div>
            <span className="panel-sparkle" aria-hidden="true">✳</span>
          </div>

          <div className="property-block">
            <div className="property-heading">
              <span className="property-label">Forma</span>
              <span className="property-value">{currentShape.label}</span>
            </div>
            <div className="property-shapes">
              {shapes.map((shape) => (
                <button
                  className={`property-shape${selectedShape === shape.id ? ' selected' : ''}`}
                  key={shape.id}
                  type="button"
                  aria-label={`Selecionar ${shape.label.toLowerCase()}`}
                  aria-pressed={selectedShape === shape.id}
                  onClick={() => {
                    setSelectedShape(shape.id)
                    setShapeVisible(true)
                  }}
                >
                  <ShapeIcon type={shape.icon} />
                </button>
              ))}
            </div>
          </div>

          <div className="property-divider" />

          <div className="property-block rotation-block">
            <div className="property-heading">
              <label className="property-label" htmlFor="rotation-range">Rotação</label>
              <span className="property-value">{rotation}°</span>
            </div>
            <div className="rotation-controls">
              <button type="button" aria-label="Girar 45 graus para a esquerda" onClick={() => setRotation((value) => (value - 45 + 360) % 360)}>↶</button>
              <input
                id="rotation-range"
                type="range"
                min="0"
                max="359"
                value={rotation}
                onChange={(event) => setRotation(Number(event.target.value))}
                aria-label="Ângulo de rotação"
              />
              <button type="button" aria-label="Girar 45 graus para a direita" onClick={() => setRotation((value) => (value + 45) % 360)}>↷</button>
            </div>
          </div>

          <div className="property-divider" />

          <div className="property-block color-block">
            <div className="property-heading">
              <span className="property-label">Cor</span>
              <span className="property-value color-name"><i style={{ backgroundColor: selectedColor }} />{currentColor}</span>
            </div>
            <div className="color-grid" role="group" aria-label="Paleta de cores">
              {colors.map((color) => (
                <button
                  className={`color-swatch${selectedColor === color.value ? ' selected' : ''}${color.value === '#ffffff' ? ' swatch-white' : ''}`}
                  key={color.value}
                  type="button"
                  style={{ '--swatch-color': color.value }}
                  aria-label={`Cor ${color.name.toLowerCase()}`}
                  aria-pressed={selectedColor === color.value}
                  onClick={() => setSelectedColor(color.value)}
                >
                  {selectedColor === color.value && <span aria-hidden="true">✓</span>}
                </button>
              ))}
              <label className="custom-color" title="Escolher outra cor">
                <input
                  type="color"
                  value={selectedColor}
                  aria-label="Escolher uma cor personalizada"
                  onChange={(event) => setSelectedColor(event.target.value)}
                />
                <span aria-hidden="true">+</span>
              </label>
            </div>
            <label className="hex-input">
              <span>HEX</span>
              <input
                value={selectedColor.toUpperCase()}
                onChange={(event) => {
                  const value = event.target.value
                  if (/^#[0-9A-Fa-f]{6}$/.test(value)) setSelectedColor(value)
                }}
                aria-label="Código hexadecimal da cor"
                maxLength={7}
              />
              <span className="hex-copy" aria-hidden="true">⌘</span>
            </label>
          </div>

          <div className="property-divider" />

          <div className="property-block image-block">
            <div className="property-heading">
              <span className="property-label">Imagem</span>
              <span className="property-value">Prévia instantânea</span>
            </div>
            <label className="image-upload">
              <input type="file" accept="image/*" onChange={addImage} aria-label="Selecionar imagem" />
              <span className="upload-icon" aria-hidden="true">＋</span>
              <span>{image ? 'Trocar imagem' : 'Adicionar imagem'}</span>
            </label>
            {image && (
              <div className="image-file">
                <img src={image.url} alt="" />
                <span title={image.name}>{image.name}</span>
                <button type="button" aria-label="Remover imagem" onClick={() => setImage(null)}>×</button>
              </div>
            )}
          </div>

          <div className="panel-note">
            <span aria-hidden="true">✦</span>
            <p>Suas mudanças aparecem na prancheta na hora.</p>
          </div>
          <button className="reset-button" type="button" onClick={() => {
            setSelectedShape('circle')
            setSelectedColor(colors[0].value)
            setShapeVisible(true)
            setRotation(0)
            setImage(null)
          }}>
            <span aria-hidden="true">↺</span> Recomeçar desenho
          </button>
        </aside>
      </div>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
