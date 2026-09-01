'use client';

export default function TypographyTest() {
  return (
    <div className="typo section last">
        <p className="eyebrow">Eyebrow</p>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>
        <p className="title"><strong>Title</strong> ipsum dolor sit amet</p>
        <p className="lead"><strong>Lead</strong> vivamus mauris purus, <a href="#test">link text</a> non magna non, posuere iaculis sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vitae nisi quis tellus vehicula dapibus. Nullam vitae dignissim libero, vitae pharetra lectus. Donec vel sagittis quam.</p>
        <p><strong>Paragraph</strong> lorem ipsum dolor sit amet <a href="#test">link text</a>, consectetur adipiscing elit. Nam sed rutrum ex. Nunc ac semper neque, sed finibus nibh. Mauris venenatis a nunc ut varius. Pellentesque at neque efficitur, volutpat ligula mattis, hendrerit neque. Integer aliquam sapien a lectus facilisis suscipit. Maecenas facilisis auctor elementum.</p>
        <p className="meta"><strong>Meta</strong> cursus non magna non <a href="#test">link text</a> adispicing</p>
        <div className="text-2-columns">
            <p>Paragraph columns lorem ipsum dolor sit amet link text, consectetur adipiscing elit. <span className="pill">Nam</span> sed rutrum ex. Nunc ac semper neque, sed finibus nibh. Mauris venenatis a nunc ut varius. Pellentesque at neque efficitur, volutpat ligula mattis, hendrerit neque. Integer aliquam sapien a lectus facilisis suscipit. Maecenas facilisis auctor elementum.</p>
        </div>
        <ul>
            <li>List item</li>
            <li>List item
                <ul>
                    <li>Sub item</li>
                    <li>Sub item</li>
                    <li>Sub item</li>
                </ul>
            </li>
            <li>List item</li>
        </ul>
        <blockquote>
            <p><strong>Simple quote</strong> lorem ipsum dolor sit amet link text, consectetur adipiscing elit. Nam sed rutrum ex</p>
            <cite>Citation text</cite>
        </blockquote>
        <hr />
        <p><strong>Bold</strong></p>
        <p><em>Italic</em></p>
        <p><a href="#test">Link text</a></p>
        <p>Superscript m<sup>2</sup></p>
        <p>Subscript O<sub>2</sub></p>
        <p>Smaller <small>inline text</small></p>
        <div className="actions">
            <button>Button</button>
            <a className='button' href="#test">Link Button</a>
            <button className="secondary">Secondary Button</button>
            <a className='button-secondary' href="#test">Secondary Link Button</a>
        </div>
    </div>
  );
}