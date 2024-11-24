import React, { useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);

  // get datas from API with fetch
  useEffect(() => {
    fetch('http://localhost:8080/api/products?goldPrice=60.0')
      .then(response => response.json())
      .then(data => {
        const updatedProducts = data.map(product => {
          const normalizedPopularityScore = (product.popularityScore / 100) * 5;
          product.normalizedPopularityScore = normalizedPopularityScore.toFixed(1);
          return product;
        });
        setProducts(updatedProducts);
      })
      .catch(err => {
        setError('Error fetching product data');
        console.error(err);
      });
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // update color according to selection
  const updateColor = (index, color) => {
    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index].selectedColor = color;
      return updatedProducts;
    });
  };

  // arrow right and left shift operations
  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };

  // swipe operations
  const handleTouchStart = (e) => {
    const touchStart = e.touches[0].clientX;
    let touchEnd = 0;

    const handleTouchMove = (e) => {
      touchEnd = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (touchStart - touchEnd > 100) {
        scrollRight();
      } else if (touchEnd - touchStart > 100) {
        scrollLeft();
      }

      carouselRef.current.removeEventListener('touchmove', handleTouchMove);
      carouselRef.current.removeEventListener('touchend', handleTouchEnd);
    };

    carouselRef.current.addEventListener('touchmove', handleTouchMove);
    carouselRef.current.addEventListener('touchend', handleTouchEnd);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="App">
      <h1>Product List</h1>

      <div className="carousel-container" ref={carouselRef} onTouchStart={handleTouchStart}>
        {products.map((product, index) => (
          <div key={product.name} className="carousel-item">
            <div>
              <img
                src={product.images[product.selectedColor || "yellow"]}
                alt={`${product.name} ${product.selectedColor || "yellow"}`}
                style={{ width: '80%', height: '80%', borderRadius: '20px' }}
              />
            </div>

            <h2 style={{ fontWeight: 'lighter' }}>{product.name}</h2>
            <p style={{
              fontFamily: 'Montserrat Regular, sans-serif',
              fontSize: '15px'
            }}>{formatPrice(product.price)} USD</p>

            <div>
              {/* buttons for color selection */}
              <Button
                variant="contained"
                onClick={() => updateColor(index, 'yellow')}
                sx={{
                  backgroundColor: '#E6CA97',
                  border: product.selectedColor === 'yellow' ? '2px solid black' : 'none',
                  '&:hover': {
                    backgroundColor: '#E6CA97',
                  },
                  borderRadius: '50%',
                  width: '25px',
                  height: '25px',
                  minWidth: 'unset',
                  minHeight: 'unset',
                  padding: 0,
                  fontFamily: 'Avenir Book, sans-serif',
                  marginRight: '8px',
                  boxShadow: 'none',
                }}
              />

              <Button
                variant="contained"
                onClick={() => updateColor(index, 'white')}
                sx={{
                  backgroundColor: '#D9D9D9',
                  border: product.selectedColor === 'white' ? '2px solid black' : 'none',
                  '&:hover': {
                    backgroundColor: '#D9D9D9',
                  },
                  borderRadius: '50%',
                  width: '25px',
                  height: '25px',
                  minWidth: 'unset',
                  minHeight: 'unset',
                  padding: 0,
                  fontFamily: 'Avenir Book, sans-serif',
                  marginRight: '8px',
                  boxShadow: 'none',
                }}
              />

              <Button
                variant="contained"
                onClick={() => updateColor(index, 'rose')}
                sx={{
                  backgroundColor: '#E1A4A9',
                  border: product.selectedColor === 'rose' ? '2px solid black' : 'none',
                  '&:hover': {
                    backgroundColor: '#E1A4A9',
                  },
                  borderRadius: '50%',
                  width: '25px',
                  height: '25px',
                  minWidth: 'unset',
                  minHeight: 'unset',
                  padding: 0,
                  fontFamily: 'Avenir Book, sans-serif',
                  marginRight: '8px',
                  boxShadow: 'none',
                }}
              />

              <p style={{ textAlign: 'left' }}>
                {product.selectedColor ? product.selectedColor : 'Yellow Gold'}
              </p>

              {/* to show the popularity score*/}
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Stack spacing={1}>
                  <Rating
                    name="half-rating-read"
                    defaultValue={parseFloat(product.normalizedPopularityScore)}
                    precision={0.1}
                    readOnly
                  />
                </Stack>
                {/* to show the popularity scoree by converting to a score out of 5, with 1 decimal place*/}
                <p style={{
                  marginLeft: '8px',
                  fontFamily: 'Avenir Book, sans-serif',
                  fontSize: '14px',
                  fontStyle: 'normal'
                }}>
                  {product.normalizedPopularityScore} / 5
                </p>
              </div>



            </div>
          </div>
        ))}
      </div>

      {/*arrow buttons for carousel*/}
      <div className="arrow arrow-left" onClick={scrollLeft}>{"<"}</div>
      <div className="arrow arrow-right" onClick={scrollRight}>{">"}</div>
    </div>
  );
}

export default App;
