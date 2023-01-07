import React, { useState } from "react";
import { formatDate } from "../utils/formatter";
import {
  useProducts,
  useUpdateProduct,
  useOrderAllProducts,
  useDecrementSupplyCounts,
} from "../hooks/products";
import { toast } from "react-toastify";
import { sortByProductName } from "../utils/sortter";
import Input from "../components/Form/Input";
import { ProductActionButton, ProductName } from "../components/ProductList";
import { EmptyList, HeaderListItem, List, ListItem } from "../components/List";
import { Card } from "../components/Card";

function Dashboard() {
  const products = useProducts();
  const productsSortedByName = sortByProductName(products);

  return (
    <div className="prose md:max-w-lg lg:max-w-2xl mx-auto">
      <DecrementSupplyCounts />
      <RequestedProducts products={productsSortedByName} />
      <OrderedProducts products={productsSortedByName} />
    </div>
  );
}

function DecrementSupplyCounts() {
  const { mutate: decrementSupplyCounts } = useDecrementSupplyCounts();

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const counts = {};
    for (const [name, value] of formData) {
      counts[name] = value !== "" ? Number(value) : 0;
    }

    decrementSupplyCounts(counts);

    toast.success("Operation Supply Quantities Decremented", {
      position: "bottom-center",
      theme: "colored",
    });
  };

  return (
    <>
      <h2 className="text-center mt-10">Dashboard</h2>
      <div className="px-1 md:px-0">
        <Card className="mb-3">
          <h3 className="m-0">Orders Completed</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-x-1">
              <h4 className="col-span-2">Jewelry</h4>
              <Input name="jewelryM" type="number" label="Medium Orders" />
              <Input name="jewelryL" type="number" label="Large Orders" />
            </div>
            <div className="grid grid-cols-2 gap-x-1">
              <h4 className="col-span-2">Handbag</h4>
              <Input name="handbagS" type="number" label="Small Orders" />
              <Input name="handbagM" type="number" label="Medium Orders" />
              <Input name="handbagL" type="number" label="Large Orders" />
              <Input name="handbagXL" type="number" label="X-Large Orders" />
            </div>
            <input
              type="submit"
              value="Confirm"
              className="btn btn-primary btn-block mt-8"
            />
          </form>
        </Card>
      </div>
    </>
  );
}

function RequestedProducts({ products }) {
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: orderAllProducts } = useOrderAllProducts();

  const requestedProducts = products.filter(
    (product) => product.status === "Requested"
  );

  const disableButtonIfEmpty =
    requestedProducts.length === 0 ? "btn-disabled" : "";

  const markProductAsOrdered = (product) => {
    const updates = {
      ...product,
      status: "Ordered",
      lastOrderedDate: new Date(),
    };

    updateProduct(updates);
    toast.success("Marked As Ordered", {
      position: "bottom-center",
      theme: "colored",
    });
  };

  const markAllProductsAsOrdered = () => {
    orderAllProducts();
    toast.success("Marked All As Ordered", {
      position: "bottom-center",
      theme: "colored",
    });
  };

  const notifyManager = () => {
    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*New Request - ${formatDate(new Date())}*`,
        },
      },
      {
        type: "divider",
      },
    ];

    requestedProducts.forEach((product) => {
      let productName;
      if (product?.purchaseLink)
        productName = `<${product.purchaseLink}|*${product.name}*>`;
      else productName = `*${product.name}*`;

      const newBlock = {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${productName}\nQuantity: ${product.quantity}`,
        },
      };

      blocks.push(newBlock, { type: "divider" });
    });

    blocks.push(
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<https://flow-switch.netlify.app/|Open App>`,
        },
      },
      { type: "divider" }
    );

    fetch(process.env.REACT_APP_SLACK_WEBHOOK_API, {
      method: "POST",
      body: JSON.stringify({ blocks }),
    });

    toast.success("Manager Notified", {
      position: "bottom-center",
      theme: "colored",
    });
  };

  return (
    <>
      <h2 className="text-center mt-10">Requested Products</h2>
      <div className="text-center">
        <button
          className={`btn btn-secondary btn-sm ${disableButtonIfEmpty}`}
          onClick={notifyManager}
        >
          Notify Manager
        </button>
        <button
          className={`btn btn-sm ml-3 ${disableButtonIfEmpty}`}
          onClick={markAllProductsAsOrdered}
        >
          Mark All As Ordered
        </button>
      </div>
      <List>
        <HeaderListItem className="grid-cols-3" style={{ minWidth: "350px" }}>
          <div className="col-span-2">Name</div>
          <div>Action</div>
        </HeaderListItem>
        {requestedProducts.length === 0 ? (
          <EmptyList message="No products to display." />
        ) : (
          requestedProducts.map((product, index) => (
            <ListItem
              className="grid-cols-3"
              key={product._id}
              index={index}
              style={{ minWidth: "350px" }}
            >
              <ProductName className="col-span-2" product={product} />
              <div>
                <ProductActionButton
                  onClick={() => markProductAsOrdered(product)}
                >
                  Mark Ordered
                </ProductActionButton>
              </div>
            </ListItem>
          ))
        )}
      </List>
    </>
  );
}

function OrderedProducts({ products }) {
  const orderedProducts = products.filter(
    (product) => product.status === "Ordered"
  );

  return (
    <>
      <h2 className="text-center mb-0">Ordered Products</h2>
      <List>
        <HeaderListItem className="grid-cols-3">
          <div className="col-span-2">Name</div>
          <div>Date Ordered</div>
        </HeaderListItem>
        {orderedProducts.length === 0 ? (
          <EmptyList message="No products to display." />
        ) : (
          orderedProducts.map((product, index) => (
            <ListItem
              className="grid-cols-3"
              key={product._id}
              index={index}
              style={{ minWidth: "350px" }}
            >
              <ProductName product={product} className="col-span-2" />
              <div>{formatDate(product?.lastOrderedDate) ?? "--"}</div>
            </ListItem>
          ))
        )}
      </List>
    </>
  );
}

export default Dashboard;
